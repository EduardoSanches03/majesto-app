import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(true);
  private loadedImages = new Set<string>();
  private totalImages = 0;
  private progressSubject = new BehaviorSubject<number>(0);
  private componentsToLoad = new Set<string>();
  private loadedComponents = new Set<string>();

  public loading$ = this.loadingSubject.asObservable();
  public progress$ = this.progressSubject.asObservable();

  constructor() {}

  // Registra um componente que precisa ser carregado
  registerComponent(componentName: string): void {
    this.componentsToLoad.add(componentName);
    console.log(
      `Componente registrado: ${componentName}. Total: ${this.componentsToLoad.size}`
    );
  }

  // Marca um componente como carregado
  markComponentAsLoaded(componentName: string): void {
    this.loadedComponents.add(componentName);
    console.log(
      `Componente carregado: ${componentName}. Carregados: ${this.loadedComponents.size}/${this.componentsToLoad.size}`
    );

    // Verifica se todos os componentes foram carregados
    if (
      this.loadedComponents.size === this.componentsToLoad.size &&
      this.componentsToLoad.size > 0
    ) {
      console.log(
        'Todos os componentes carregados! Iniciando carregamento de imagens...'
      );
      setTimeout(() => {
        this.loadAllImagesAfterComponents();
      }, 500);
    }
  }

  // Método para começar o carregamento
  startLoading(): void {
    this.loadingSubject.next(true);
    this.loadedImages.clear();
    this.totalImages = 0;
    this.progressSubject.next(0);
    this.componentsToLoad.clear();
    this.loadedComponents.clear();
  }

  // Método para finalizar o carregamento
  finishLoading(): void {
    this.loadingSubject.next(false);
    this.progressSubject.next(100);
    console.log('Carregamento finalizado!');
  }

  // Carrega imagens depois que todos os componentes estão prontos
  private async loadAllImagesAfterComponents(): Promise<void> {
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 5;

      const searchForImages = () => {
        const images = this.findAllImages();

        if (images.length === 0 && attempts < maxAttempts) {
          attempts++;
          console.log(`Tentativa ${attempts}: Buscando imagens...`);
          setTimeout(searchForImages, 800);
          return;
        }

        if (images.length === 0) {
          console.log('Nenhuma imagem encontrada, finalizando carregamento');
          this.finishLoading();
          resolve();
          return;
        }

        console.log(`Encontradas ${images.length} imagens para carregar`);
        this.totalImages = images.length;
        let loadedCount = 0;

        const onImageLoad = () => {
          loadedCount++;
          const progress = (loadedCount / this.totalImages) * 100;
          this.progressSubject.next(progress);
          console.log(
            `Imagem ${loadedCount}/${
              this.totalImages
            } carregada (${progress.toFixed(0)}%)`
          );

          if (loadedCount === this.totalImages) {
            setTimeout(() => {
              this.finishLoading();
              resolve();
            }, 300);
          }
        };

        images.forEach((imgSrc) => this.loadImage(imgSrc, onImageLoad));
      };

      searchForImages();
    });
  }

  // Encontra todas as imagens na página
  private findAllImages(): string[] {
    const imageSources: string[] = [];

    // Busca mais completa por imagens
    const imgTags = document.querySelectorAll('img');
    imgTags.forEach((img) => {
      const src =
        img.src ||
        img.getAttribute('data-src') ||
        img.getAttribute('data-lazy-src');
      if (
        src &&
        !src.includes('data:') &&
        !src.includes('blob:') &&
        src.length > 10
      ) {
        imageSources.push(src);
      }
    });

    // Background images
    const elementsWithBg = document.querySelectorAll('*');
    elementsWithBg.forEach((element) => {
      const bgImage = window.getComputedStyle(element).backgroundImage;
      if (bgImage && bgImage !== 'none') {
        const matches = bgImage.match(/url\(["']?([^"']*)["']?\)/);
        if (
          matches &&
          matches[1] &&
          !matches[1].includes('data:') &&
          matches[1].length > 10
        ) {
          imageSources.push(matches[1]);
        }
      }
    });

    // Srcset images
    const imgWithSrcset = document.querySelectorAll('img[srcset]');
    imgWithSrcset.forEach((img) => {
      const srcset = img.getAttribute('srcset');
      if (srcset) {
        const urls = srcset.split(',').map((item) => item.trim().split(' ')[0]);
        urls.forEach((url) => {
          if (url && !url.includes('data:') && url.length > 10) {
            imageSources.push(url);
          }
        });
      }
    });

    const uniqueSources = [...new Set(imageSources)];
    console.log(`Imagens encontradas:`, uniqueSources);

    return uniqueSources;
  }

  // Carrega uma imagem específica
  private loadImage(src: string, onLoad: () => void): void {
    if (this.loadedImages.has(src)) {
      onLoad();
      return;
    }

    const img = new Image();

    img.onload = () => {
      this.loadedImages.add(src);
      onLoad();
    };

    img.onerror = () => {
      console.warn(`Erro ao carregar imagem: ${src}`);
      this.loadedImages.add(src);
      onLoad();
    };

    // Timeout para não travar em imagens que não respondem
    setTimeout(() => {
      if (!this.loadedImages.has(src)) {
        console.warn(`Timeout na imagem: ${src}`);
        this.loadedImages.add(src);
        onLoad();
      }
    }, 10000); // 10 segundos de timeout

    img.src = src;
  }
}
