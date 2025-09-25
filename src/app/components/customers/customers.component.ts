import { Component, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent implements AfterViewInit {
  platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const videos =
      document.querySelectorAll<HTMLVideoElement>('.customers .video');

    videos.forEach((video) => {
      // Força propriedades essenciais
      video.muted = true;
      video.volume = 0;
      video.autoplay = true;
      // @ts-ignore - compat de browsers
      video.playsInline = true;
      video.loop = true;
      video.removeAttribute('controls');

      const ensureMuted = () => {
        if (!video.muted || video.volume > 0) {
          video.muted = true;
          video.volume = 0;
        }
      };

      // Garante silêncio em diferentes momentos
      video.addEventListener('loadedmetadata', ensureMuted);
      video.addEventListener('play', ensureMuted);
      video.addEventListener('volumechange', ensureMuted);

      // Tenta iniciar reprodução (alguns browsers exigem interação; silencioso ajuda)
      video.play?.().catch(() => {
        // Ignora erros de autoplay; continuará em loop quando permitido
      });
    });
  }
}
