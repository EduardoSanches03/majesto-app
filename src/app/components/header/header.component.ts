import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  Component,
  OnInit,
  HostListener,
  inject,
  PLATFORM_ID,
  AfterViewInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, AfterViewInit {
  menuOpen = false;
  circleX = 0;
  circleY = 0;
  isVisible = true;
  lastScrollY = 0;
  lastScrollTop = 0;
  isScrolledUp = false;
  isAtTop = true;
  platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const menuButton = document.querySelector('.menu-icon') as HTMLElement;
      if (menuButton) {
        const rect = menuButton.getBoundingClientRect();
        this.circleX = rect.left + rect.width / 2;
        this.circleY = rect.top + rect.height / 2;
      }
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupMenuCloseOnClick();
    }
  }

  setupMenuCloseOnClick() {
    // Seleciona todos os links que começam com #
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        // Fecha o menu
        if (this.menuOpen) {
          this.menuOpen = false;
          document.body.style.overflow = '';
        }

        // Faz o scroll suave
        const target = document.querySelector(link.getAttribute('href')!);
        target?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (!isPlatformBrowser(this.platformId)) return;

    const currentScrollY = window.scrollY;
    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    this.isAtTop = currentScrollY <= 10;

    if (this.menuOpen) {
      this.isVisible = true;
      return;
    }

    if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
      this.isVisible = false;
    } else {
      this.isVisible = true;
    }

    if (currentScroll > this.lastScrollTop) {
      this.isScrolledUp = false;
    } else {
      this.isScrolledUp = true;
    }

    this.lastScrollY = currentScrollY;
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

  toggleMenu(event: MouseEvent) {
    if (!isPlatformBrowser(this.platformId)) return;

    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();

    this.circleX = rect.left + rect.width / 2;
    this.circleY = rect.top + rect.height / 2;

    this.menuOpen = !this.menuOpen;

    if (this.menuOpen) {
      document.body.style.overflow = 'hidden';
      this.isVisible = true;
    } else {
      document.body.style.overflow = '';
    }
  }
}
