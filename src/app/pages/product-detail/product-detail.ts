import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { Comments } from '../../components/comments/comments';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [Comments],
  templateUrl: './product-detail.html',
})
export class ProductDetail {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  product = signal<Product | undefined>(undefined);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(id).subscribe((product) => this.product.set(product));
  }
}
