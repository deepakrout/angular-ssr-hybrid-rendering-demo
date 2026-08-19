import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  // Relative URL works both in the browser and during SSR because Angular's
  // fetch-based HttpClient resolves it against the incoming request origin
  // when running on the server (see provideHttpClient(withFetch())).
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products');
  }

  getProduct(id: string): Observable<Product | undefined> {
    return new Observable((subscriber) => {
      this.getProducts().subscribe({
        next: (products) => {
          subscriber.next(products.find((p) => p.id === id));
          subscriber.complete();
        },
        error: (err) => subscriber.error(err),
      });
    });
  }
}
