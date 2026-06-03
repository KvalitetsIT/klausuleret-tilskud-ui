import { Component, inject } from '@angular/core';
import { ClauseTabs } from 'src/app/features/clause-tabs/clause-tabs';
import { Toolbar } from 'src/app/features/toolbar/toolbar';
import { App } from '../../app';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ClauseTabs, Toolbar],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  app = inject(App);
}
