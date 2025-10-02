import { NgOptimizedImage } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NgFor } from '@angular/common';
import {
  SlickCarouselModule,
  SlickCarouselComponent,
} from 'ngx-slick-carousel';

@Component({
  selector: 'app-customers-slide',
  standalone: true,
  imports: [NgOptimizedImage, SlickCarouselModule, NgFor],
  templateUrl: './customers-slide.component.html',
  styleUrl: './customers-slide.component.scss',
})
export class CustomersSlideComponent {
  @ViewChild('slickModal') slickModal!: SlickCarouselComponent;

  slideConfig = {
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    infinite: true,
    autoplay: true,
    centerMode: true,
    centerPadding: '100px',
    speed: 500,
    cssEase: 'ease-in-out',
    draggable: true,
    swipe: true,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          centerPadding: '60px',
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          centerPadding: '40px',
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: '80px',
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          centerPadding: '40px',
        },
      },
    ],
  };

  logos = [
    'https://pfpl3j0odur2kscj.public.blob.vercel-storage.com/Images/white%20logos/10pasteis%20white.png',
    'https://pfpl3j0odur2kscj.public.blob.vercel-storage.com/Images/white%20logos/apolar%20white.png',
    'https://pfpl3j0odur2kscj.public.blob.vercel-storage.com/Images/white%20logos/asia%20white.png',
    'https://pfpl3j0odur2kscj.public.blob.vercel-storage.com/Images/white%20logos/bubble%20white.png',
    'https://pfpl3j0odur2kscj.public.blob.vercel-storage.com/Images/white%20logos/continental%20white.png',
    'https://pfpl3j0odur2kscj.public.blob.vercel-storage.com/Images/white%20logos/cookie%20white.png',
    'https://pfpl3j0odur2kscj.public.blob.vercel-storage.com/Images/white%20logos/luah%20white.png',
    'https://pfpl3j0odur2kscj.public.blob.vercel-storage.com/Images/white%20logos/sirene%20white.png',
  ];
  next() {
    if (this.slickModal) {
      this.slickModal.slickNext();
    }
  }

  prev() {
    if (this.slickModal) {
      this.slickModal.slickPrev();
    }
  }
}
