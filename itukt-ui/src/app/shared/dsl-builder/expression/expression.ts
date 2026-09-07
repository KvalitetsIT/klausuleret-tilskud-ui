import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DslHighlightPipe } from '../../dsl-highlight-pipe';
import { ExpressionType } from '../../expression-types';

@Component({
    standalone: true,
    selector: 'expression',
    templateUrl: 'expression.html',
    styleUrls: ['expression.css'],
    imports: [
        MatButtonModule, 
        MatIconModule,
        DslHighlightPipe,
    ],
})
export class Expression {
    @Input({ required: true }) identifier!: ExpressionType;
    @Input({ required: true }) action!: () => void;

}