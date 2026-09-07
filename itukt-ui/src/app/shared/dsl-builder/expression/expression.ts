import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    standalone: true,
    selector: 'expression',
    templateUrl: 'expression.html',
    styleUrls: ['expression.css'],
    imports: [
        MatButtonModule, 
        MatIconModule,
    ],
})
export class Expression {
    @Input({ required: true }) action!: () => void;

}