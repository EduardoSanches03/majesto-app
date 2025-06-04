import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { ComponentLoaderMixin } from '../component-loader.mixin';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent
  extends ComponentLoaderMixin('header')
  implements OnInit
{
  menuOpen = false;
  circleX = 0;
  circleY = 0;
  isVisible = true;
  lastScrollY = 0;
  lastScrollTop = 0;
  isScrolledUp = false;

  ngOnInit() {
    // Inicializa as posições do círculo com a posição do botão do menu
    const menuButton = document.querySelector('.menu-icon') as HTMLElement;
    if (menuButton) {
      const rect = menuButton.getBoundingClientRect();
      this.circleX = rect.left + rect.width / 2;
      this.circleY = rect.top + rect.height / 2;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const currentScrollY = window.scrollY;
    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    // Se o menu estiver aberto, mantém o header visível
    if (this.menuOpen) {
      this.isVisible = true;
      return;
    }

    // Determina a direção do scroll
    if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
      // Scroll para baixo e passou de 100px
      this.isVisible = false;
    } else {
      // Scroll para cima
      this.isVisible = true;
    }

    if (currentScroll > this.lastScrollTop) {
      // Scroll para baixo
      this.isScrolledUp = false;
    } else {
      // Scroll para cima
      this.isScrolledUp = true;
    }

    this.lastScrollY = currentScrollY;
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

  toggleMenu(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();

    // Atualiza a posição do círculo
    this.circleX = rect.left + rect.width / 2;
    this.circleY = rect.top + rect.height / 2;

    this.menuOpen = !this.menuOpen;

    if (this.menuOpen) {
      document.body.style.overflow = 'hidden'; // Desabilita rolagem
      this.isVisible = true; // Garante que o header fique visível quando o menu estiver aberto
    } else {
      document.body.style.overflow = ''; // Habilita rolagem de volta
    }
  }
}
