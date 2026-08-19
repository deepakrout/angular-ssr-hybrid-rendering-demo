import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home {
  // Purely client-rendered per app.routes.server.ts (RenderMode.Client),
  // so it's fine for this to depend on browser-only state like Date.now().
  renderedAt = signal(new Date().toLocaleTimeString());
}
