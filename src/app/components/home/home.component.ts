import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
  PLATFORM_ID,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from './../header/header.component';
import { CustomersComponent } from './../customers/customers.component';
import { CasesComponent } from './../cases/cases.component';
import { AboutUsComponent } from './../about-us/about-us.component';
import { SolutionsComponent } from '../solutions/solutions.component';
import { CustomersSlideComponent } from '../customers-slide/customers-slide.component';
import { SuccessCasesComponent } from '../success-cases/success-cases.component';
import { PartnersComponent } from '../partners/partners.component';
import { LoadingComponent } from '../loading/loading.component';
import { LoadingService } from '../../services/loading/loading.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    CustomersComponent,
    CasesComponent,
    AboutUsComponent,
    SolutionsComponent,
    CustomersSlideComponent,
    SuccessCasesComponent,
    PartnersComponent,
    LoadingComponent, // Adiciona o componente de loading
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <!-- Tela de carregamento -->
    <app-loading></app-loading>

    <!-- Conteúdo principal - só aparece quando não está carregando -->
    <div class="main-content" *ngIf="!(loadingService.loading$ | async)">
      <section class="home-section">
        <video
          #backgroundVideo
          autoplay
          muted="true"
          [muted]="true"
          loop
          playsinline
          preload="metadata"
          class="background-video"
          src="./assets/corporativeVideoAi.webm"
          poster="./assets/video-poster.jpg"
          [volume]="0"
          (loadedmetadata)="ensureVideoMuted($event)"
          (canplay)="ensureVideoMuted($event)"
          (play)="ensureVideoMuted($event)"
        ></video>

        <app-header></app-header>
      </section>

      <ng-container *ngIf="isPlatformBrowser(platformId)">
        <app-customers></app-customers>
        <app-cases></app-cases>
        <app-about-us></app-about-us>
        <app-solutions></app-solutions>
        <app-customers-slide></app-customers-slide>
        <app-success-cases></app-success-cases>
        <app-partners></app-partners>
      </ng-container>
    </div>
  `,
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('casesRef') casesRef!: ElementRef;
  @ViewChild('aboutUsRef') aboutUsRef!: ElementRef;
  @ViewChild('backgroundVideo') backgroundVideo!: ElementRef<HTMLVideoElement>;

  platformId = inject(PLATFORM_ID);
  isPlatformBrowser = isPlatformBrowser;

  constructor(public loadingService: LoadingService) {}

  ngOnInit(): void {
    // Inicia o carregamento
    this.loadingService.startLoading();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Setup do vídeo em background
      this.setupBackgroundVideo();

      // Aguarda os componentes renderizarem e depois inicia o carregamento das imagens
      setTimeout(() => {
        this.startImageLoading();
      }, 1000); // 1 segundo
    }
  }

  private setupBackgroundVideo(): void {
    // Pequeno delay para garantir que o DOM está pronto
    setTimeout(() => {
      const video = this.backgroundVideo?.nativeElement;
      if (!video) {
        console.warn('⚠️ Elemento de vídeo não encontrado');
        return;
      }

      // Força as configurações do vídeo
      video.muted = true;
      video.volume = 0;
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true;

      console.log('🎬 Configurando vídeo de fundo...');
      console.log('Video muted:', video.muted);
      console.log('Video volume:', video.volume);

      // Tenta reproduzir o vídeo
      this.playVideo(video);

      // Listener para garantir que o vídeo continue mutado
      video.addEventListener('volumechange', () => {
        if (!video.muted || video.volume > 0) {
          console.log('🔇 Forçando vídeo a ficar mutado');
          video.muted = true;
          video.volume = 0;
        }
      });

      // Listener para quando o vídeo começar a tocar
      video.addEventListener('play', () => {
        console.log('▶️ Vídeo começou a reproduzir');
        video.muted = true;
        video.volume = 0;
      });
    }, 100);
  }

  private async playVideo(video: HTMLVideoElement): Promise<void> {
    try {
      await video.play();
      console.log('✅ Vídeo reproduzindo com sucesso (mutado)');
    } catch (error) {
      console.warn('⚠️ Erro ao reproduzir vídeo automaticamente:', error);

      // Fallback: tenta novamente após interação do usuário
      this.setupUserInteractionFallback(video);
    }
  }

  private setupUserInteractionFallback(video: HTMLVideoElement): void {
    console.log('🖱️ Aguardando interação do usuário para reproduzir vídeo...');

    const playOnInteraction = async () => {
      try {
        video.muted = true;
        video.volume = 0;
        await video.play();
        console.log('✅ Vídeo reproduzindo após interação do usuário');

        // Remove os listeners após sucesso
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
        document.removeEventListener('keydown', playOnInteraction);
      } catch (error) {
        console.warn('⚠️ Ainda não foi possível reproduzir vídeo:', error);
      }
    };

    // Adiciona listeners para primeira interação
    document.addEventListener('click', playOnInteraction, { once: true });
    document.addEventListener('touchstart', playOnInteraction, { once: true });
    document.addEventListener('keydown', playOnInteraction, { once: true });
  }

  // Método chamado pelos eventos do template
  ensureVideoMuted(event: Event): void {
    const video = event.target as HTMLVideoElement;
    if (video) {
      video.muted = true;
      video.volume = 0;
      console.log(
        '🔇 Garantindo que vídeo está mutado via evento:',
        event.type
      );
    }
  }

  private async startImageLoading(): Promise<void> {
    try {
      console.log('🎯 Iniciando processo de carregamento das mídias...');

      // Aguarda todas as imagens e vídeos carregarem (com timeout de segurança)
      await this.loadingService.loadAllMedia(); // Usar o novo método que carrega vídeos também

      console.log('🎉 Processo de carregamento concluído!');
    } catch (error) {
      console.error('💥 Erro durante o carregamento:', error);
      // Sempre libera o site, mesmo com erro
      this.loadingService.finishLoading();
    }
  }
}
