import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Configuration } from '@api/configuration';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  public readonly title = signal('itukt-ui');

  public constructor(private config: Configuration) {
    console.log('App initialized');
    console.log('API Base URL:', this.config.basePath);
  }
}
