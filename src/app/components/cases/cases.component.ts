import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, NgIf } from '@angular/common';

@Component({
  selector: 'app-cases',
  standalone: true,
  imports: [],
  templateUrl: './cases.component.html',
  styleUrl: './cases.component.scss',
})
export class CasesComponent implements AfterViewInit {
  constructor() {}
  @ViewChild('casesRef', { static: true }) casesRef!: ElementRef;
  showcases = false;
  platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.showcases = true;
            observer.disconnect(); // evita observar de novo
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(this.casesRef.nativeElement);
    }
  }
}
