import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { Clauses } from '../clauses/clauses';

@Component({
  selector: 'app-clause-tabs',
  standalone: true,
  imports: [Clauses, MatCardModule, MatTabsModule],
  templateUrl: 'clause-tabs.html',
  styleUrls: ['clause-tabs.css']
})
export class ClauseTabs {
}
