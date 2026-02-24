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

    console.debug('App initialized');
    console.debug('Auth Gateway URL:', environment.authGatewayUrl);

    http.get(environment.authGatewayUrl + '/gateway/auth-check', { withCredentials: true }).subscribe({
      next: (_) => {
        console.debug('Successfully authenticated');
        this.userAuthenticated.set(true);
      },
      error: (err) => {
        console.debug('Error authenticating:', err);
        document.location.href = environment.authGatewayUrl + '/gateway/login';
      }
    });
  }
}
