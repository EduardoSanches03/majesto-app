import { Component, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ComponentLoaderMixin } from '../component-loader.mixin';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent extends ComponentLoaderMixin('about-us') {
  constructor() {
    super(); // MUITO IMPORTANTE!
  }
}
