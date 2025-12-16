import { Component, inject } from '@angular/core';
import { Clauses } from '../../features/clauses/clauses';
import { App } from '../../app';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Clauses, MatCardModule, MatToolbarModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  app = inject(App);

    constructor(){
    console.log("HOME")
  }
}
