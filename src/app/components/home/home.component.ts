import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
  PLATFORM_ID,
  CUSTOM_ELEMENTS_SCHEMA,
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('casesRef') casesRef!: ElementRef;
  @ViewChild('aboutUsRef') aboutUsRef!: ElementRef;

  showCases = false;
  showAboutUs = false;
  platformId = inject(PLATFORM_ID);
  isPlatformBrowser = isPlatformBrowser;

  constructor() {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Aguardar o carregamento do DOM
      setTimeout(() => {
        // Forçar a detecção de mudanças
        this.loadComponents();
      }, 0);
    }
  }

  private loadComponents(): void {
    // Carregar os componentes de forma assíncrona
    Promise.resolve().then(() => {
      // Forçar a detecção de mudanças
      this.loadCustomers();
      this.loadCases();
      this.loadAboutUs();
      this.loadSolutions();
      this.loadCustomersSlide();
      this.loadSuccessCases();
      this.loadPartners();
    });
  }

  private loadCustomers(): void {
    import('./../customers/customers.component').then(
      (m) => m.CustomersComponent
    );
  }

  private loadCases(): void {
    import('./../cases/cases.component').then((m) => m.CasesComponent);
  }

  private loadAboutUs(): void {
    import('./../about-us/about-us.component').then((m) => m.AboutUsComponent);
  }

  private loadSolutions(): void {
    import('../solutions/solutions.component').then(
      (m) => m.SolutionsComponent
    );
  }

  private loadCustomersSlide(): void {
    import('../customers-slide/customers-slide.component').then(
      (m) => m.CustomersSlideComponent
    );
  }

  private loadSuccessCases(): void {
    import('../success-cases/success-cases.component').then(
      (m) => m.SuccessCasesComponent
    );
  }

  private loadPartners(): void {
    import('../partners/partners.component').then((m) => m.PartnersComponent);
  }
}
