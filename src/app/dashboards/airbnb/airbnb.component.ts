import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { JsonPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-airbnb',
  standalone: true,
  imports: [JsonPipe, NgIf],
  template: `
    <h2>Asheville Airbnb Pricing</h2>

    <button (click)="trainModel()" [disabled]="loading">
      {{ loading ? 'Training...' : 'Train & Load Charts' }}
    </button>

    <p *ngIf="error" style="color:#b00">{{ error }}</p>

    <div *ngIf="metrics">
      <h3>Metrics</h3>
      <pre>{{ metrics | json }}</pre>
    </div>

    <section *ngIf="avgUrl">
      <h3>Average Price by Neighborhood</h3>
      <img [src]="avgUrl" alt="Average Price by Neighborhood" />
    </section>

    <section *ngIf="fiUrl">
      <h3>Top Features by Price Impact</h3>
      <img [src]="fiUrl" alt="Feature Importance" />
    </section>
  `
})
export class AirbnbComponent {
  loading = false;
  error = '';
  metrics: any;
  avgUrl?: SafeUrl;
  fiUrl?: SafeUrl;

  private base = 'http://localhost:8000';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  trainModel() {
    this.loading = true;
    this.error = '';
    this.metrics = undefined;
    this.avgUrl = undefined;
    this.fiUrl = undefined;

    this.http.post<any>(`${this.base}/train`, {
      city: 'asheville',
      date: '2025-06-17'
    }).subscribe({
      next: () => {
        // fetch metrics (optional — you already get them in /train if you want to use res.metrics)
        this.http.get<any>(`${this.base}/metrics`).subscribe(m => this.metrics = m);

        // fetch PNG charts as blobs
        this.http.get(`${this.base}/charts/avg-price-neighborhood.png`, { responseType: 'blob' })
          .subscribe(b => this.avgUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(b)));

        this.http.get(`${this.base}/charts/feature-importance.png?k=12`, { responseType: 'blob' })
          .subscribe(b => this.fiUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(b)));

        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.detail || 'Training failed';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
