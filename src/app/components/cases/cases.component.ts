import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { ComponentLoaderMixin } from '../component-loader.mixin';



@Component({
  selector: 'app-cases',
  standalone: true,
  imports: [],
  templateUrl: './cases.component.html',
  styleUrl: './cases.component.scss',
})
export class CasesComponent extends ComponentLoaderMixin('cases') implements AfterViewInit{
  constructor() {
    super(); // IMPORTANTE: Chama o construtor do mixin
  }
    @ViewChild('casesRef', { static: true }) casesRef!: ElementRef;
    showcases = false;
    

    ngAfterViewInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            this.showcases = true;
            observer.disconnect(); // evita observar de novo
          }
        }, { threshold: 0.1 });

        observer.observe(this.casesRef.nativeElement);
      }
    }
}
