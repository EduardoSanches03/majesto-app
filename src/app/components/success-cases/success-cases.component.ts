import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import {
  CommonModule,
  NgOptimizedImage,
  isPlatformBrowser,
} from '@angular/common';

interface Testimonial {
  id: number;
  text: string;
  author: string;
  local: string;
  videoUrl: string;
}

@Component({
  selector: 'app-success-cases',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-cases.component.html',
  styleUrls: ['./success-cases.component.scss'],
})
export class SuccessCasesComponent implements AfterViewInit, OnDestroy {
  currentIndex = 0;
  private resizeObserver: ResizeObserver | null = null;
  private timeouts: number[] = [];

  testimonials: Testimonial[] = [
    {
      id: 1,
      text: 'Relato do primeiro caso de sucesso...',
      author: 'Eduardo Sanches',
      local: 'Franqueado Curitiba',
      videoUrl: 'assets/videos/case1.mp4',
    },
    {
      id: 2,
      text: 'Relato do segundo caso de sucesso...',
      author: 'Cliente',
      local: 'Franqueado São Paulo',
      videoUrl: 'assets/videos/case2.mp4',
    },
    {
      id: 3,
      text: 'Relato do terceiro caso de sucesso...',
      author: 'Cliente',
      local: 'Franqueado Rio de Janeiro',
      videoUrl: 'assets/videos/case3.mp4',
    },
  ];

  @ViewChild('authorRef') authorRef!: ElementRef;
  @ViewChild('localRef') localRef!: ElementRef;
  localWidth: number | null = null;
  authorFontSize = 32;
  localFontSize = 16;
  platformId = inject(PLATFORM_ID);

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.resizeObserver = new ResizeObserver(() => {
        this.adjustTextLayout();
      });
      this.adjustTextLayout();
      if (this.authorRef?.nativeElement) {
        this.resizeObserver.observe(this.authorRef.nativeElement);
      }
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
  }

  adjustTextLayout() {
    const timeout = window.setTimeout(() => {
      this.setLocalWidth();
      this.fitAuthorText();
      this.fitLocalText();
    });
    this.timeouts.push(timeout);
  }

  setLocalWidth() {
    if (this.authorRef?.nativeElement) {
      this.localWidth = this.authorRef.nativeElement.offsetWidth;
    }
  }

  fitAuthorText() {
    if (this.authorRef?.nativeElement) {
      const container = this.authorRef.nativeElement.parentElement;
      const maxWidth = container.offsetWidth;
      let fontSize = 32;
      this.authorRef.nativeElement.style.fontSize = fontSize + 'px';
      while (
        this.authorRef.nativeElement.scrollWidth > maxWidth &&
        fontSize > 10
      ) {
        fontSize -= 1;
        this.authorRef.nativeElement.style.fontSize = fontSize + 'px';
      }
      this.authorFontSize = fontSize;
      this.cdr.detectChanges();
    }
  }

  fitLocalText() {
    if (this.localRef?.nativeElement && this.localWidth) {
      let fontSize = 16;
      this.localRef.nativeElement.style.fontSize = fontSize + 'px';
      while (
        this.localRef.nativeElement.scrollWidth > this.localWidth &&
        fontSize > 8
      ) {
        fontSize -= 1;
        this.localRef.nativeElement.style.fontSize = fontSize + 'px';
      }
      this.localFontSize = fontSize;
      this.cdr.detectChanges();
    }
  }

  nextTestimonial() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    this.cdr.detectChanges();
    this.adjustTextLayout();
  }

  previousTestimonial() {
    this.currentIndex =
      (this.currentIndex - 1 + this.testimonials.length) %
      this.testimonials.length;
    this.cdr.detectChanges();
    this.adjustTextLayout();
  }

  getCurrentTestimonial(): Testimonial {
    return this.testimonials[this.currentIndex];
  }

  getLocalLetterSpacing(): string {
    const author = this.getCurrentTestimonial().author || '';
    const local = this.getCurrentTestimonial().local || '';
    if (local.length <= 1) return 'normal';

    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.fontSize = '2rem';
    tempSpan.style.fontWeight = '400';
    tempSpan.style.fontFamily = 'inherit';
    tempSpan.innerText = author;
    document.body.appendChild(tempSpan);
    const authorWidth = tempSpan.offsetWidth;

    tempSpan.innerText = local;
    tempSpan.style.fontSize = '1.1rem';
    tempSpan.style.fontWeight = '400';
    const localWidth = tempSpan.offsetWidth;

    document.body.removeChild(tempSpan);

    const extraSpace = authorWidth - localWidth;
    const spacing = extraSpace / (local.length - 1);

    if (spacing <= 0 || isNaN(spacing) || !isFinite(spacing)) return 'normal';
    if (spacing > 50) return 'normal';
    return `${spacing}px`;
  }

  getLocalChars(): string[] {
    return (this.getCurrentTestimonial().local || '').split('');
  }
}
