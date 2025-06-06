import { NgOptimizedImage } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NgFor } from '@angular/common';
import {
  SlickCarouselModule,
  SlickCarouselComponent,
} from 'ngx-slick-carousel';
import { ComponentLoaderMixin } from '../component-loader.mixin';

@Component({
  selector: 'app-customers-slide',
  standalone: true,
  imports: [NgOptimizedImage, SlickCarouselModule, NgFor],
  templateUrl: './customers-slide.component.html',
  styleUrl: './customers-slide.component.scss',
})
export class CustomersSlideComponent extends ComponentLoaderMixin('customers-slide') {
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
    'assets/Logo.png',
    'assets/Logo.png',
    'assets/Logo.png',
    'assets/Logo.png',
    'assets/Logo.png',
    'assets/Logo.png',
    'assets/Logo.png',
    'assets/Logo.png',
    'assets/Logo.png',
    'assets/Logo.png',
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
