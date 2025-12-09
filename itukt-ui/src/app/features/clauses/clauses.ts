import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ClausesService } from '../../services/clauses';
import { DslHighlightPipe } from '../../shared/dsl-highlight-pipe';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DslOutput } from '@api/model/dslOutput';
import { MatTableModule } from '@angular/material/table';

// TODO: Det kunne være en idé at skifte til at bruge: https://material.angular.dev/components/table/
@Component({
  selector: 'app-clauses',
  standalone: true,
  imports: [DslHighlightPipe, MatCardModule, MatIconModule, MatTableModule],
  templateUrl: 'clauses.html',
  styleUrls: ['clauses.css']
})
export class Clauses {
  private service = inject(ClausesService);

  clauses = toSignal<Array<DslOutput>>(
    this.service.getClausesAsDsl()
  );

  displayedColumns: string[] = ['dsl', 'error'];
}
