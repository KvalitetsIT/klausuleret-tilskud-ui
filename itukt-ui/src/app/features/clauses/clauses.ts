import { Component, inject, Input, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ClausesService } from '../../services/clauses';
import { DslHighlightPipe } from '../../shared/dsl-highlight-pipe';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ClauseStatus } from '@api/index';
import { DslOutput } from '@api/model/dslOutput';
import { ClauseDialog } from '../clause-dialog/clause-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-clauses',
  standalone: true,
  imports: [DslHighlightPipe, MatCardModule, MatIconModule, MatTableModule],
  templateUrl: 'clauses.html',
  styleUrls: ['clauses.css']
})
export class Clauses {
  @Input() status: 'DRAFT' | 'ACTIVE' = 'ACTIVE';

  private service = inject(ClausesService);
  private clauseDialog = inject(MatDialog);

  activeClauses = toSignal<Array<DslOutput>>(
    this.service.getClauses(ClauseStatus.Active)
  );
  draftClauses = toSignal<Array<DslOutput>>(
    this.service.getClauses(ClauseStatus.Draft)
  );

  displayedColumns: string[] = ['name', 'dsl', 'error'];

  clauses: Signal<Array<DslOutput> | undefined> = signal(undefined);


  ngOnInit() {
    this.clauses = this.status === 'ACTIVE' ? this.activeClauses : this.draftClauses;
  }

  onRowClick(row: DslOutput): void {
    const dialogRef = this.clauseDialog.open(ClauseDialog, {
      minWidth: '700px',
      maxWidth: '1500px',
      data: { clause: row }
    });
  }
}
