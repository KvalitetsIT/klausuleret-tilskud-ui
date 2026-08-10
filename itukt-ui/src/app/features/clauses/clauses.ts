import { Component, inject, Input, signal, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { DslHighlightPipe } from '../../shared/dsl-highlight-pipe';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ClauseStatus, ManagementService } from '@api/index';
import { DslOutput } from '@api/model/dslOutput';
import { ClauseDialogService } from 'src/app/services/clause-dialog-service';
import { ClauseService } from 'src/app/services/clause-service';

@Component({
  selector: 'app-clauses',
  standalone: true,
  imports: [DslHighlightPipe, MatCardModule, MatIconModule, MatTableModule, MatButtonModule],
  templateUrl: 'clauses.html',
  styleUrls: ['clauses.css']
})
export class Clauses {
  @Input() status: ClauseStatus = ClauseStatus.Active;

  private service = inject(ClauseService);
  private clauseDialogService = inject(ClauseDialogService);
  private api = inject(ManagementService);

  activeClauses = toSignal<Array<DslOutput>>(
    this.service.getClauses(ClauseStatus.Active)
  );
  draftClauses = toSignal<Array<DslOutput>>(
    this.service.getClauses(ClauseStatus.Draft)
  );
  inactiveClauses = toSignal<Array<DslOutput>>(
    this.service.getClauses(ClauseStatus.Inactive)
  );

  displayedColumns: string[] = ['name', 'dsl', 'error'];

  clauses: Signal<Array<DslOutput> | undefined> = signal(undefined);


  ngOnInit() {
    this.clauses = this.getClauses();
  }

  onRowClick(row: DslOutput): void {
    this.clauseDialogService.open(row);
  }

  getExportUrl(): string {
    return this.api.configuration.basePath + '/management/2025/08/01/clauses/dsl.csv?status=' + this.status;
  }

  getClauses() {
    switch (this.status) {
      case ClauseStatus.Active:
        return this.activeClauses;
      case ClauseStatus.Draft:
        return this.draftClauses;
      case ClauseStatus.Inactive:
        return this.inactiveClauses;
    }
  }
}
