import { Component, inject, Input, signal } from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { ClauseService } from 'src/app/services/clause-service';

@Component({
    standalone: true,
    selector: 'drugs-count-chip',
    templateUrl: 'drugs-count-chip.html',
    styleUrls: ['drugs-count-chip.css'],
    imports: [MatChip],
})
export class DrugsCountChip {
    @Input({ required: true }) clauseName!: string;

    private clauseService = inject(ClauseService);

    drugsCount = signal<number | undefined>(undefined);

    ngOnChanges(): void {
        this.drugsCount.set(undefined);
        if (this.clauseName.trim().length > 0) {
            this.clauseService.getClauseDrugsCount(this.clauseName)
                .subscribe({
                    next: (count) => this.drugsCount.set(count)
                });
        }
    }
}