import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ClauseTabs } from 'src/app/features/clause-tabs/clause-tabs';
import { App } from '../../app';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ClauseTabs, MatCardModule, MatToolbarModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  app = inject(App);

    constructor(){
    console.log("HOME")
  }
}
