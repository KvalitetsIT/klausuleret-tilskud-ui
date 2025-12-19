import { Component, inject, model } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { Clauses } from '../clauses/clauses';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CreateClauseDialog } from '../create-clause-dialog/create-clause-dialog';

@Component({
  selector: 'app-clause-tabs',
  standalone: true,
  imports: [Clauses, MatCardModule, MatTabsModule, MatIconModule, MatButtonModule],
  templateUrl: 'clause-tabs.html',
  styleUrls: ['clause-tabs.css']
})
export class ClauseTabs {
  dialog = inject(MatDialog);

  openCreateClauseDialog(): void {
    const dialogRef = this.dialog.open(CreateClauseDialog, {
      minWidth: '700px'
    });
  }
}
