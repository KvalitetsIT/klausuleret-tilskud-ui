import { Component, inject } from '@angular/core';
import { ClauseTabs } from 'src/app/features/clause-tabs/clause-tabs';
import { Toolbar } from 'src/app/features/toolbar/toolbar';
import { App } from '../../app';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ClauseTabs, 
    Toolbar, 
    MatProgressSpinner, 
    MatIcon,
    MatButton
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  app = inject(App);

  login() {
        document.location.href = environment.authGatewayUrl + '/gateway/login';
  }
}
