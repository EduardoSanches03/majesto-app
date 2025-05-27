import { Component } from '@angular/core';
import { ComponentLoaderMixin } from '../component-loader.mixin';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent extends ComponentLoaderMixin('customers') {

}
