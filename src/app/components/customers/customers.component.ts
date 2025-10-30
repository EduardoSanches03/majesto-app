import {
  Component,
  AfterViewInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent implements AfterViewInit, OnDestroy {
  platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const videos =
      document.querySelectorAll<HTMLVideoElement>('.customers .video');

    if (!videos.length) return;

    // Configura Intersection Observer para pausar vídeos fora da tela
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.0, // Dispara assim que qualquer parte do vídeo aparecer
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;

        if (entry.isIntersecting) {
          // Quando visível: reproduz
          if (video.paused) {
            video.play().catch(() => {
              // Silencia erros de autoplay
            });
          }
        } else {
          // Quando não visível: pausa
          if (!video.paused) {
            video.pause();
          }
        }
      });
    }, options);

    videos.forEach((video) => {
      video.muted = true;
      video.volume = 0;
      video.autoplay = false; // Desativa autoplay, o observer vai controlar
      video.playsInline = true;
      video.loop = true;
      video.preload = 'auto'; // Carrega os vídeos antecipadamente
      video.removeAttribute('controls');

      // Garante que os vídeos ficam sempre mutados
      const ensureMuted = () => {
        if (!video.muted || video.volume > 0) {
          video.muted = true;
          video.volume = 0;
        }
      };

      video.addEventListener('loadedmetadata', ensureMuted);
      video.addEventListener('play', ensureMuted);
      video.addEventListener('volumechange', ensureMuted);

      // Observa o vídeo para controlar play/pause
      this.observer?.observe(video);
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
