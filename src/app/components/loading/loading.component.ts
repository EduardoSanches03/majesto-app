import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading/loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay" *ngIf="isLoading$ | async">
      <div class="loading-container">
        <!-- Logo ou nome da empresa -->
        <div class="logo">
          <h1>Sua Empresa</h1>
        </div>

        <!-- Barra de progresso -->
        <div class="progress-container">
          <div class="progress-bar">
            <div
              class="progress-fill"
              [style.width.%]="progress$ | async"
            ></div>
          </div>
          <div class="progress-text">
            Carregando... {{ progress$ | async | number : '1.0-0' }}%
          </div>
        </div>

        <!-- Spinner animado -->
        <div class="spinner"></div>
      </div>
    </div>
  `,
  styles: [
    `
      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease-in;
      }

      .loading-container {
        text-align: center;
        color: white;
        max-width: 400px;
        padding: 2rem;
      }

      .logo h1 {
        font-size: 2.5rem;
        margin-bottom: 2rem;
        font-weight: bold;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      }

      .progress-container {
        margin-bottom: 2rem;
      }

      .progress-bar {
        width: 100%;
        height: 8px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 1rem;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #00d4ff, #ff6b6b);
        border-radius: 4px;
        transition: width 0.3s ease;
        animation: shimmer 2s infinite;
      }

      .progress-text {
        font-size: 1.1rem;
        opacity: 0.9;
      }

      .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid rgba(255, 255, 255, 0.2);
        border-top: 4px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes shimmer {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0.7;
        }
        100% {
          opacity: 1;
        }
      }
    `,
  ],
})
export class LoadingComponent implements OnInit {
  isLoading$: Observable<boolean>;
  progress$: Observable<number>;

  constructor(private loadingService: LoadingService) {
    this.isLoading$ = this.loadingService.loading$;
    this.progress$ = this.loadingService.progress$;
  }

  ngOnInit(): void {
    // Componente só observa o estado do loading
  }
}
