import { AboutUsComponent } from './../about-us/about-us.component';
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from './../header/header.component';
import { CustomersComponent } from './../customers/customers.component';
import { CasesComponent } from './../cases/cases.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    CustomersComponent,
    CasesComponent,
    AboutUsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  // View Children para as referências no template
  @ViewChild('casesRef') casesRef!: ElementRef;
  @ViewChild('aboutUsRef') aboutUsRef!: ElementRef;

  // Flags para controlar visibilidade
  showCases = false;
  showAboutUs = false;


platformId = inject(PLATFORM_ID);

  constructor() {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
    }
  }
  private setupIntersectionObserver() {
    // Observador para o componente Cases
    const casesObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.showCases = true;
            // Você pode desconectar o observador se quiser carregar o componente apenas uma vez
            // casesObserver.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    ); // Considerar visível quando 10% do elemento estiver visível

    // Observador para o componente AboutUs
    const aboutUsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.showAboutUs = true;
            // Você pode desconectar o observador se quiser carregar o componente apenas uma vez
            // aboutUsObserver.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    // Iniciar observação
    if (this.casesRef) {
      casesObserver.observe(this.casesRef.nativeElement);
    }

    if (this.aboutUsRef) {
      aboutUsObserver.observe(this.aboutUsRef.nativeElement);
    }
  }
}
