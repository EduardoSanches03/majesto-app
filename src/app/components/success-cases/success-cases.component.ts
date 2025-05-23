import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  id: number;
  text: string;
  author: string;
  videoUrl: string;
}

@Component({
  selector: 'app-success-cases',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-cases.component.html',
  styleUrls: ['./success-cases.component.scss'],
})
export class SuccessCasesComponent {
  currentIndex = 0;
  testimonials: Testimonial[] = [
    {
      id: 1,
      text: 'Relato do primeiro caso de sucesso...',
      author: 'Cliente 1',
      videoUrl: 'assets/videos/case1.mp4',
    },
    {
      id: 2,
      text: 'Relato do segundo caso de sucesso...',
      author: 'Cliente 2',
      videoUrl: 'assets/videos/case2.mp4',
    },
    {
      id: 3,
      text: 'Relato do terceiro caso de sucesso...',
      author: 'Cliente 3',
      videoUrl: 'assets/videos/case3.mp4',
    },
  ];

  nextTestimonial() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  previousTestimonial() {
    this.currentIndex =
      (this.currentIndex - 1 + this.testimonials.length) %
      this.testimonials.length;
  }

  getCurrentTestimonial(): Testimonial {
    return this.testimonials[this.currentIndex];
  }
}
