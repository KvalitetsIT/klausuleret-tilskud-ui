import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ClausesService } from '../../services/clauses';
import { ClauseOutput } from '@api/models/clause-output'; 
import { DslHighlightPipe } from '../../shared/dsl-highlight-pipe';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// TODO: Der mangler tests.
// TODO: Vi bør skifte til at bruge https://material.angular.dev/components/table/
@Component({
  selector: 'app-clauses',
  standalone: true,
  imports: [DslHighlightPipe, MatCardModule, MatIconModule],
  templateUrl: 'clauses.html',
  styleUrls: ['clauses.css']
})
export class Clauses{
  private service = inject(ClausesService);

  // Signals i stedet for async pipe (som i gamle dage)
  clauses = toSignal<ClauseOutput[]>(
    this.service.getClauses()
  );

  // TODO: Skift til at hente DSL direkte måske?
  summarize(expr: any): string {
    if (!expr) return '';
    if (expr.type === 'StringCondition') return `${expr.field} = "${expr.value}"`;
    if (expr.type === 'NumberCondition') return `${expr.field} ${expr.operator} ${expr.value}`;
    if (expr.type === 'BinaryExpression') return `(${this.summarize(expr.left)}) ${expr.operator} (${this.summarize(expr.right)})`;
    return '';
  }
}
