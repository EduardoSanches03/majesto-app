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
import { AboutUsComponent } from './../about-us/about-us.component';
import { SolutionsComponent } from '../solutions/solutions.component';
import { CustomersSlideComponent } from '../customers-slide/customers-slide.component';
import { SuccessCasesComponent } from '../success-cases/success-cases.component';
import { PartnersComponent } from '../partners/partners.component';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    CustomersComponent,
    AboutUsComponent,
    SolutionsComponent,
    CustomersSlideComponent,
    SuccessCasesComponent,
    PartnersComponent,
    FooterComponent
],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('casesRef') casesRef!: ElementRef;
  @ViewChild('aboutUsRef') aboutUsRef!: ElementRef;
  @ViewChild('backgroundVideo') backgroundVideo!: ElementRef<HTMLVideoElement>;

  platformId = inject(PLATFORM_ID);
  isPlatformBrowser = isPlatformBrowser;

  ngOnInit(): void {
    // Removido: lógica de loading
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Setup do vídeo em background
      this.setupBackgroundVideo();
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
}
