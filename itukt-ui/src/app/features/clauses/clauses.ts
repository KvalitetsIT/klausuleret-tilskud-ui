import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ClausesService } from '../../services/clauses';
import { DslHighlightPipe } from '../../shared/dsl-highlight-pipe';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DslOutput } from '@api/models/dsl-output';

// TODO: Det kunne være en idé at skifte til at bruge: https://material.angular.dev/components/table/
@Component({
  selector: 'app-clauses',
  standalone: true,
  imports: [DslHighlightPipe, MatCardModule, MatIconModule],
  templateUrl: 'clauses.html',
  styleUrls: ['clauses.css']
})
export class Clauses{
  private service = inject(ClausesService);

  clauses = toSignal<Array<DslOutput>>(
    this.service.getClausesAsDsl()
  );
}
