import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentLoaderMixin } from '../component-loader.mixin';
@Component({
  selector: 'app-solutions',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './solutions.component.html',
  styleUrl: './solutions.component.scss'
})
export class SolutionsComponent extends ComponentLoaderMixin('solutions') {

}
