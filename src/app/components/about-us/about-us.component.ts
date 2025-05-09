import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private routerSubscription?: Subscription;
  private backgroundImageLoaded = false;
  private loadedImages: HTMLImageElement[] = [];

  ngOnInit() {
    // Pré-carregar imagem de fundo se ainda não estiver carregada
    if (!this.backgroundImageLoaded) {
      const img = new Image();
      img.onload = () => {
        this.backgroundImageLoaded = true;
        this.loadedImages.push(img); // Manter referência para evitar GC
      };
      img.src = '../../../assets/background-about-us.webp';
    }

    // Impedir descarregamento de recursos em navegações
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => {
        // Manter referências às imagens carregadas
        // Isso impede que o GC remova as imagens da memória
        console.log('Preserving loaded images:', this.loadedImages.length);
      });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
    // Não limpar this.loadedImages para manter as referências
  }
}
