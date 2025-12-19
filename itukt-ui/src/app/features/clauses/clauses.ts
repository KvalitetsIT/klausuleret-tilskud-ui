import { Component, inject, Input, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ClausesService } from '../../services/clauses';
import { DslHighlightPipe } from '../../shared/dsl-highlight-pipe';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DslOutput } from '@api/model/dslOutput';
import { MatTableModule } from '@angular/material/table';
import { ClauseStatus } from '@api/index';

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
}
