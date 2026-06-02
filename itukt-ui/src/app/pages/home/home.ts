import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ClauseTabs } from 'src/app/features/clause-tabs/clause-tabs';
import { App } from '../../app';
import { environment } from '../../../environments/environment';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ClauseTabs, MatCardModule, MatToolbarModule, MatButton, MatIcon, MatDivider],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  app = inject(App);
  http = inject(HttpClient);

  logout() {
    document.location.href = environment.authGatewayUrl + '/saml/logout';
  }
}
