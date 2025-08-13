import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  train(city: string, date: string) {
    return this.http.post(`${this.base}/train?city=${encodeURIComponent(city)}&date=${encodeURIComponent(date)}`, {});
  }

  getMetrics() {
    return this.http.get(`${this.base}/metrics`);
  }

  getAvgPriceChart(): Observable<SafeUrl> {
    return this.http.get(`${this.base}/charts/avg-price-neighborhood.png`, { responseType: 'blob' })
      .pipe(map(b => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(b))));
  }

  getFeatureImportanceChart(k=12): Observable<SafeUrl> {
    return this.http.get(`${this.base}/charts/feature-importance.png?k=${k}`, { responseType: 'blob' })
      .pipe(map(b => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(b))));
  }
}
