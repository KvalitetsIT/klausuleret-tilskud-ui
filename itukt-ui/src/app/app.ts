import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GatewayService } from '@gateway/api/api';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App implements OnInit, OnDestroy {
  public readonly title = signal('itukt-ui');
  public readonly userLoggedIn = signal<boolean | undefined>(undefined);
  public readonly userAuthorized = signal<boolean | undefined>(undefined);
  private readonly gatewayService: GatewayService;

  private intervalId: any;

  ngOnInit(): void {
    console.debug('App initialized');
    console.debug('Auth Gateway URL:', environment.authGatewayUrl);

    this.intervalId = setInterval(() => {
      // Checks if the user is still authenticated
      this.checkAuth();
    }, 5000);   
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId)
  }

  public constructor(gatewayService: GatewayService) {
    this.gatewayService = gatewayService
  }

  private checkAuth() {
    console.debug('Checking authentication status');
    this.gatewayService.authCheck().subscribe({
      next: () => {
        console.debug('Successfully authorized user');
        this.userLoggedIn.set(true);
        this.userAuthorized.set(true);
      },
      error: (err: HttpErrorResponse) => {
        this.userAuthorized.set(false);
        if (err.status === 403) {
          // User is logged in but not authorized
          this.userLoggedIn.set(true);
        } else {
          this.userLoggedIn.set(false);
        }
      }
    });
  }
}
