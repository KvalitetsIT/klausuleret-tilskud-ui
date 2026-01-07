import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { DslOutput } from '@api/index';
import { DslHighlightPipe } from 'src/app/shared/dsl-highlight-pipe';

@Component({
    selector: 'clause-read-items',
    templateUrl: 'clause-read-items.html',
    styleUrls: ['../clause-content-items.css'],
    imports: [MatListModule, DslHighlightPipe, DatePipe],
})
export class ClauseReadItems {
    @Input({ required: true }) clause!: DslOutput;
}