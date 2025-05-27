import { PLATFORM_ID, inject, AfterViewInit, OnDestroy } from '@angular/core';
import { LoadingService } from '../services/loading/loading.service';
import { isPlatformBrowser } from '@angular/common';

export function ComponentLoaderMixin(componentName: string) {
  return class {
    protected loadingService = inject(LoadingService);
    protected platformId = inject(PLATFORM_ID);
    protected isPlatformBrowser = isPlatformBrowser;

    constructor() {
      // Marca o componente como carregado depois que tudo estiver pronto
      this.waitForComponentToLoad(componentName);
    }

    private waitForComponentToLoad(name: string): void {
      if (isPlatformBrowser(this.platformId)) {
        // Aguarda um pouco para garantir que o componente foi renderizado
        setTimeout(() => {
          // Verifica se há imagens no componente e aguarda elas carregarem
          this.checkImagesInComponent(name);
        }, 300);
      }
    }

    private checkImagesInComponent(name: string): void {
      const componentElement = document.querySelector(
        `app-${name.replace(/([A-Z])/g, '-$1').toLowerCase()}`
      );

      if (!componentElement) {
        // Se não encontrou o elemento, marca como carregado mesmo assim
        this.loadingService.markComponentAsLoaded(name);
        return;
      }

      const images = componentElement.querySelectorAll('img');
      const backgroundElements = componentElement.querySelectorAll('*');

      let totalImages = images.length;
      let loadedImages = 0;

      // Conta imagens de background também
      backgroundElements.forEach((el) => {
        const bgImage = window.getComputedStyle(el).backgroundImage;
        if (bgImage && bgImage !== 'none' && bgImage.includes('url(')) {
          totalImages++;
        }
      });

      // Se não há imagens, marca como carregado
      if (totalImages === 0) {
        this.loadingService.markComponentAsLoaded(name);
        return;
      }

      const onImageLoad = () => {
        loadedImages++;
        if (loadedImages >= totalImages) {
          this.loadingService.markComponentAsLoaded(name);
        }
      };

      // Verifica imagens normais
      images.forEach((img) => {
        if (img.complete && img.naturalHeight !== 0) {
          onImageLoad();
        } else {
          img.onload = onImageLoad;
          img.onerror = onImageLoad; // Conta erro como "carregado" para não travar
        }
      });

      // Para imagens de background, já conta como carregadas
      // (é mais difícil detectar quando carregam)
      backgroundElements.forEach((el) => {
        const bgImage = window.getComputedStyle(el).backgroundImage;
        if (bgImage && bgImage !== 'none' && bgImage.includes('url(')) {
          // Simula carregamento da imagem de background
          setTimeout(onImageLoad, 100);
        }
      });

      // Timeout de segurança - se demorar muito, marca como carregado
      setTimeout(() => {
        if (loadedImages < totalImages) {
          console.warn(
            `Timeout no componente ${name}. Marcando como carregado.`
          );
          this.loadingService.markComponentAsLoaded(name);
        }
      }, 8000); // 8 segundos de timeout
    }
  };
}
