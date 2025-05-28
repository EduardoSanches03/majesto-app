import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading/loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  isLoading$: Observable<boolean>;
  progress$: Observable<number>;

  constructor(private loadingService: LoadingService) {
    this.isLoading$ = this.loadingService.loading$;
    this.progress$ = this.loadingService.progress$;
  }

  ngOnInit(): void {}
}
