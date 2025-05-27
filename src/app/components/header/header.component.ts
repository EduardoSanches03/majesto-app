import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentLoaderMixin } from '../component-loader.mixin';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage, CommonModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent extends ComponentLoaderMixin('header') {
  menuOpen = false;
  circleX = 0;
  circleY = 0;

  toggleMenu(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();

    // centro do botão
    this.circleX = rect.left + rect.width / 2;
    this.circleY = rect.top + rect.height / 2;

    this.menuOpen = !this.menuOpen;

    if (this.menuOpen) {
      document.body.style.overflow = 'hidden';  // Desabilita rolagem
    } else {
      document.body.style.overflow = '';  // Habilita rolagem de volta
    }
  }
}
