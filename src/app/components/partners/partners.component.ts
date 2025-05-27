import { Component } from '@angular/core';
import { ComponentLoaderMixin } from '../component-loader.mixin';
@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss',
})
export class PartnersComponent extends ComponentLoaderMixin('partners') {
  constructor() {
    super(); // MUITO IMPORTANTE!
  }
}
