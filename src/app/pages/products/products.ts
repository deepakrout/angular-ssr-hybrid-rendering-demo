import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './products.html',
})
export class Products {
  private productService = inject(ProductService);
  products = signal<Product[]>([]);

  constructor() {
    // Runs during SSR on the server for the initial request, and the fetched
    // data is embedded via TransferState / HttpTransferCache so the browser
    // does not re-fetch it on hydration.
    this.productService.getProducts().subscribe((products) => this.products.set(products));
  }
}
