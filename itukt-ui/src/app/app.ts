import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GatewayService } from '@gateway/api/api';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  public readonly title = signal('itukt-ui');
  public readonly userAuthorized = signal<boolean | undefined>(undefined);

  public constructor(gatewayService: GatewayService) {
    console.debug('App initialized');
    console.debug('Auth Gateway URL:', environment.authGatewayUrl);

    gatewayService.authCheck().subscribe({
      next: () => {
        console.debug('Successfully authorized user');
        this.userAuthorized.set(true);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 302) {
          console.debug('User is not authenticated, redirecting to login');
          document.location.href = environment.authGatewayUrl + '/gateway/login';
        } else {
          console.debug('Error authorizing user:', err);
          this.userAuthorized.set(false);
        }
      }
    });
  }
}
