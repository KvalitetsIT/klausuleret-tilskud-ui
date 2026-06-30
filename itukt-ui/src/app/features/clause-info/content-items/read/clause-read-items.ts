import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { DslOutput } from '@api/index';
import { DrugsCountChip } from 'src/app/shared/drugs-count-chip/drugs-count-chip';
import { DslHighlightPipe } from 'src/app/shared/dsl-highlight-pipe';

@Component({
    selector: 'clause-read-items',
    templateUrl: 'clause-read-items.html',
    styleUrls: ['../clause-content-items.css'],
    imports: [MatListModule, DslHighlightPipe, DatePipe, DrugsCountChip],
})
export class ClauseReadItems {
    @Input({ required: true }) clause!: DslOutput;
}