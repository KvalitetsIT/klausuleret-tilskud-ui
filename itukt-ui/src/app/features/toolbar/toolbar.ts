import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { environment } from '../../../environments/environment';
import { App } from '../../app';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatCardModule, MatToolbarModule, MatButton, MatIcon, MatDivider],
  templateUrl: './toolbar.html',
  styleUrls: ['./toolbar.css']
})
export class Toolbar {
  app = inject(App);

  logout() {
    document.location.href = environment.authGatewayUrl + '/saml/logout';
  }
}
