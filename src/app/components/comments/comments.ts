import { Component, input, signal } from '@angular/core';

interface Comment {
  author: string;
  text: string;
}

@Component({
  selector: 'app-comments',
  standalone: true,
  templateUrl: './comments.html',
})
export class Comments {
  productId = input.required<string>();

  // Mock data — in a real app this would be an injected CommentsService
  // hitting /api/products/:id/comments.
  comments = signal<Comment[]>([
    { author: 'Priya', text: 'Great build quality, worth the price.' },
    { author: 'Marcus', text: 'Shipped fast, exactly as described.' },
  ]);
}
