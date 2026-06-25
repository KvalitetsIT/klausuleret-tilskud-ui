import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GatewayService } from '@gateway/api/api';
import { User } from '@gateway/model/models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatCardModule, MatToolbarModule, MatButton, MatIcon, MatDivider],
  templateUrl: './toolbar.html',
  styleUrls: ['./toolbar.css']
})
export class Toolbar {
  private gatewayService = inject(GatewayService);

  user = signal<User | undefined>(undefined);
  
	ngOnInit(): void {
    this.gatewayService.getUser().subscribe({
      next: (userResp) => {
        this.user.set(userResp);
      }
    });
	}

  logout() {
    document.location.href = environment.authGatewayUrl + '/saml/logout';
  }
}
