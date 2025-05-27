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
import { ComponentLoaderMixin } from '../component-loader.mixin';
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
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          class="background-video"
          src="./assets/corporativeVideoAi.webm"
          poster="./assets/video-poster.jpg"
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
export class HomeComponent extends ComponentLoaderMixin('home') implements OnInit, AfterViewInit {
  @ViewChild('casesRef') casesRef!: ElementRef;
  @ViewChild('aboutUsRef') aboutUsRef!: ElementRef;

  constructor() {
    super(); // MUITO IMPORTANTE!
  }

  ngOnInit(): void {
    // Registra todos os componentes que precisam carregar
    this.loadingService.registerComponent('header');
    this.loadingService.registerComponent('customers');
    this.loadingService.registerComponent('cases');
    this.loadingService.registerComponent('about-us');
    this.loadingService.registerComponent('solutions');
    this.loadingService.registerComponent('customers-slide');
    this.loadingService.registerComponent('success-cases');
    this.loadingService.registerComponent('partners');

    // Inicia o carregamento
    this.loadingService.startLoading();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Aguarda um tempo para garantir que os componentes foram inicializados
      setTimeout(() => {
        this.checkComponentsLoaded();
      }, 1000);
    }
  }

  private checkComponentsLoaded(): void {
    // Simula o carregamento dos componentes
    // Você precisará implementar isso em cada componente filho
    console.log('Verificando se componentes foram carregados...');

    // Marca os componentes como carregados (temporário)
    setTimeout(() => this.loadingService.markComponentAsLoaded('header'), 100);
    setTimeout(
      () => this.loadingService.markComponentAsLoaded('customers'),
      200
    );
    setTimeout(() => this.loadingService.markComponentAsLoaded('cases'), 300);
    setTimeout(
      () => this.loadingService.markComponentAsLoaded('about-us'),
      400
    );
    setTimeout(
      () => this.loadingService.markComponentAsLoaded('solutions'),
      500
    );
    setTimeout(
      () => this.loadingService.markComponentAsLoaded('customers-slide'),
      600
    );
    setTimeout(
      () => this.loadingService.markComponentAsLoaded('success-cases'),
      700
    );
    setTimeout(
      () => this.loadingService.markComponentAsLoaded('partners'),
      800
    );
  }
}
