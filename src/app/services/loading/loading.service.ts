import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(true);
  private loadedMedia = new Set<string>();
  private totalMedia = 0;
  private progressSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();
  public progress$ = this.progressSubject.asObservable();

  constructor() {}

  // Método para começar o carregamento
  startLoading(): void {
    this.loadingSubject.next(true);
    this.loadedMedia.clear();
    this.totalMedia = 0;
    this.progressSubject.next(0);
    console.log('🚀 Iniciando carregamento...');
  }

  // Método para finalizar o carregamento
  finishLoading(): void {
    this.loadingSubject.next(false);
    this.progressSubject.next(100);
    console.log('✅ Carregamento finalizado!');
  }

  // Método principal: aguarda componentes e carrega todas as mídias
  async loadAllMedia(): Promise<void> {
    return new Promise((resolve) => {
      console.log('⏳ Aguardando componentes renderizarem...');

      // ESTRATÉGIA: Aguardar tempo fixo e depois procurar mídias
      setTimeout(() => {
        this.findAndLoadMedia(resolve);
      }, 2000); // 2 segundos para dar tempo dos componentes renderizarem
    });
  }

  // Procura e carrega todas as mídias (imagens e vídeos)
  private findAndLoadMedia(resolve: () => void): void {
    let searchAttempts = 0;
    const maxSearchAttempts = 8; // Máximo 8 tentativas

    const searchForMedia = () => {
      searchAttempts++;
      console.log(
        `🔍 Tentativa ${searchAttempts}/${maxSearchAttempts} - Procurando mídias...`
      );

      const media = this.findAllMedia();

      // Se encontrou mídias, carrega elas
      if (media.length > 0) {
        console.log(`🎬 Encontradas ${media.length} mídias para carregar`);
        this.loadMediaArray(media, resolve);
        return;
      }

      // Se não encontrou mídias mas ainda tem tentativas, tenta novamente
      if (searchAttempts < maxSearchAttempts) {
        setTimeout(searchForMedia, 750); // Espera 750ms e tenta novamente
        return;
      }

      // Se esgotou as tentativas, libera mesmo assim
      console.log('⚠️ Não encontrou mídias suficientes, liberando site...');
      this.finishLoading();
      resolve();
    };

    searchForMedia();
  }

  // Carrega um array de mídias
  private loadMediaArray(
    media: Array<{ url: string; type: 'image' | 'video' }>,
    resolve: () => void
  ): void {
    this.totalMedia = media.length;
    let loadedCount = 0;

    // Timeout de segurança - se demorar muito, libera mesmo assim
    const safetyTimeout = setTimeout(() => {
      console.log('⏰ Timeout de segurança ativado, liberando site...');
      this.finishLoading();
      resolve();
    }, 20000); // 20 segundos máximo (mais tempo por causa dos vídeos)

    const onMediaLoad = () => {
      loadedCount++;
      const progress = (loadedCount / this.totalMedia) * 100;
      this.progressSubject.next(progress);

      console.log(
        `🎥 ${loadedCount}/${
          this.totalMedia
        } mídias carregadas (${progress.toFixed(0)}%)`
      );

      // Se todas carregaram, finaliza
      if (loadedCount === this.totalMedia) {
        clearTimeout(safetyTimeout);
        setTimeout(() => {
          this.finishLoading();
          resolve();
        }, 500);
      }
    };

    // Carrega cada mídia
    media.forEach((item) => {
      if (item.type === 'image') {
        this.loadSingleImage(item.url, onMediaLoad);
      } else if (item.type === 'video') {
        this.loadSingleVideo(item.url, onMediaLoad);
      }
    });
  }

  // Encontra todas as mídias na página (imagens e vídeos)
  private findAllMedia(): Array<{ url: string; type: 'image' | 'video' }> {
    const mediaSources: Array<{ url: string; type: 'image' | 'video' }> = [];

    // 1. Busca imagens em tags <img>
    const imgTags = document.querySelectorAll('img');
    imgTags.forEach((img) => {
      const src =
        img.src ||
        img.getAttribute('data-src') ||
        img.getAttribute('data-lazy-src');
      if (src && this.isValidImageUrl(src)) {
        mediaSources.push({ url: src, type: 'image' });
      }
    });

    // 2. Busca vídeos em tags <video>
    const videoTags = document.querySelectorAll('video');
    videoTags.forEach((video) => {
      const src = video.src || video.getAttribute('data-src');
      if (src && this.isValidVideoUrl(src)) {
        mediaSources.push({ url: src, type: 'video' });
      }

      // Também verifica sources dentro do video
      const sources = video.querySelectorAll('source');
      sources.forEach((source) => {
        const srcUrl = source.src || source.getAttribute('data-src');
        if (srcUrl && this.isValidVideoUrl(srcUrl)) {
          mediaSources.push({ url: srcUrl, type: 'video' });
        }
      });
    });

    // 3. Busca imagens em background-image
    const allElements = document.querySelectorAll('*');
    allElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const bgImage = styles.backgroundImage;

      if (bgImage && bgImage !== 'none') {
        const matches = bgImage.match(/url\(["']?([^"']*)["']?\)/g);
        if (matches) {
          matches.forEach((match) => {
            const url = match.replace(/url\(["']?|["']?\)/g, '');
            if (this.isValidImageUrl(url)) {
              mediaSources.push({ url: url, type: 'image' });
            }
          });
        }
      }
    });

    // 4. Busca imagens em srcset
    const imgWithSrcset = document.querySelectorAll('img[srcset]');
    imgWithSrcset.forEach((img) => {
      const srcset = img.getAttribute('srcset');
      if (srcset) {
        const urls = srcset.split(',').map((item) => item.trim().split(' ')[0]);
        urls.forEach((url) => {
          if (url && this.isValidImageUrl(url)) {
            mediaSources.push({ url: url, type: 'image' });
          }
        });
      }
    });

    // Remove duplicatas e retorna
    const uniqueMedia = mediaSources.filter(
      (item, index, self) => index === self.findIndex((t) => t.url === item.url)
    );

    console.log(`🎬 Mídias encontradas:`, uniqueMedia);
    return uniqueMedia;
  }

  // Verifica se é uma URL de imagem válida
  private isValidImageUrl(url: string): boolean {
    if (!url || url.includes('data:') || url.includes('blob:')) {
      return false;
    }

    // Verifica se já foi carregada
    if (this.loadedMedia.has(url)) {
      return false;
    }

    // Verifica se é uma extensão de imagem comum
    const imageExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.webp',
      '.svg',
      '.bmp',
      '.avif',
    ];
    const hasImageExtension = imageExtensions.some((ext) =>
      url.toLowerCase().includes(ext)
    );

    return (
      hasImageExtension || url.includes('/assets/') || url.includes('image')
    );
  }

  // Verifica se é uma URL de vídeo válida
  private isValidVideoUrl(url: string): boolean {
    if (!url || url.includes('data:') || url.includes('blob:')) {
      return false;
    }

    // Verifica se já foi carregada
    if (this.loadedMedia.has(url)) {
      return false;
    }

    // Verifica se é uma extensão de vídeo comum
    const videoExtensions = [
      '.mp4',
      '.webm',
      '.ogg',
      '.avi',
      '.mov',
      '.wmv',
      '.flv',
      '.mkv',
    ];
    const hasVideoExtension = videoExtensions.some((ext) =>
      url.toLowerCase().includes(ext)
    );

    return (
      hasVideoExtension || url.includes('/assets/') || url.includes('video')
    );
  }

  // Carrega uma imagem específica
  private loadSingleImage(src: string, onLoad: () => void): void {
    if (this.loadedMedia.has(src)) {
      onLoad();
      return;
    }

    const img = new Image();

    // Timeout para cada imagem individual
    const timeout = setTimeout(() => {
      console.warn(`⚠️ Timeout para imagem: ${src}`);
      this.loadedMedia.add(src);
      onLoad();
    }, 8000); // 8 segundos por imagem

    img.onload = () => {
      clearTimeout(timeout);
      this.loadedMedia.add(src);
      console.log(`✅ Imagem carregada: ${src}`);
      onLoad();
    };

    img.onerror = () => {
      clearTimeout(timeout);
      console.warn(`❌ Erro ao carregar imagem: ${src}`);
      this.loadedMedia.add(src); // Marca como "carregada" para não tentar novamente
      onLoad();
    };

    img.src = src;
  }

  // Carrega um vídeo específico
  private loadSingleVideo(src: string, onLoad: () => void): void {
    if (this.loadedMedia.has(src)) {
      onLoad();
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata'; // Carrega apenas metadados, não o vídeo inteiro

    // Timeout para cada vídeo individual (mais tempo que imagens)
    const timeout = setTimeout(() => {
      console.warn(`⚠️ Timeout para vídeo: ${src}`);
      this.loadedMedia.add(src);
      onLoad();
    }, 12000); // 12 segundos por vídeo

    video.oncanplaythrough = () => {
      clearTimeout(timeout);
      this.loadedMedia.add(src);
      console.log(`✅ Vídeo carregado: ${src}`);
      onLoad();
    };

    video.onerror = () => {
      clearTimeout(timeout);
      console.warn(`❌ Erro ao carregar vídeo: ${src}`);
      this.loadedMedia.add(src); // Marca como "carregado" para não tentar novamente
      onLoad();
    };

    // Para vídeos, você pode optar por carregar apenas os metadados
    // ou usar 'canplay' ao invés de 'canplaythrough' para ser mais rápido
    video.onloadedmetadata = () => {
      clearTimeout(timeout);
      this.loadedMedia.add(src);
      console.log(`✅ Metadados do vídeo carregados: ${src}`);
      onLoad();
    };

    video.src = src;
  }

  markComponentAsLoaded(name: string): void {
    console.log(`🧩 Componente "${name}" marcado como carregado`);
  }

  // Método de compatibilidade - mantém o nome antigo
  async loadAllImages(): Promise<void> {
    return this.loadAllMedia();
  }
}
