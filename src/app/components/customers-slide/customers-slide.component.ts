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
    'https://res.cloudinary.com/dquoq5xn3/image/upload/v1762283797/10pasteis_white_lxyaid.png',
    'https://res.cloudinary.com/dquoq5xn3/image/upload/v1762283809/apolar_white_nflh4w.png',
    'https://res.cloudinary.com/dquoq5xn3/image/upload/v1762283807/asia_white_c09iuu.png',
    'https://res.cloudinary.com/dquoq5xn3/image/upload/v1762283806/bubble_white_q0iiuu.png',
    'https://res.cloudinary.com/dquoq5xn3/image/upload/v1762283802/continental_white_sgh6fl.png',
    'https://res.cloudinary.com/dquoq5xn3/image/upload/v1762283787/cookie_white_e3vgns.png',
    'https://res.cloudinary.com/dquoq5xn3/image/upload/v1762283780/luah_white_zdvcca.png',
    'https://res.cloudinary.com/dquoq5xn3/image/upload/v1762283820/sirene_white_rsgnz6.png',
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
