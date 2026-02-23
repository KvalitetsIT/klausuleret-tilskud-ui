import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ManagementService } from '@api/index';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  public readonly title = signal('itukt-ui');
  public readonly userAuthenticated = signal(false);

  public constructor(
    private managementService: ManagementService,
    private http: HttpClient) {

    console.log('App initialized');
    console.log('Auth Gateway URL:', environment.authGatewayUrl);

    http.get(environment.authGatewayUrl + '/auth-check', { withCredentials: true }).subscribe({
      next: (_) => {
        console.log('Successfully authenticated');
        this.userAuthenticated.set(true);
      },
      error: (err) => {
        console.error('Error authenticating:', err);
        document.location.href = environment.authGatewayUrl + '/login';
      }
    });
  }
}
