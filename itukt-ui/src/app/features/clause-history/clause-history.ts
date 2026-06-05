import { DatePipe } from '@angular/common';
import { Component, Input, inject, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { DslOutput } from '@api/model/dslOutput';
import { ClausesService } from 'src/app/services/clauses';
import { DslHighlightPipe } from 'src/app/shared/dsl-highlight-pipe';

@Component({
	standalone: true,
	selector: 'clause-history',
	templateUrl: 'clause-history.html',
	styleUrls: ['clause-history.css'],
	imports: [MatExpansionModule, MatIconModule, DatePipe, DslHighlightPipe, MatProgressSpinner, MatListModule]
})
export class ClauseHistory {
	@Input({ required: true }) name!: string;

	private clauseService = inject(ClausesService);

	history = signal<Array<DslOutput> | undefined>(undefined);

	ngOnInit(): void {
		this.clauseService.getClauseHistory(this.name)
			.subscribe({
				next: (history) => this.history.set(history),
				error: () => this.history.set([])
			});
	}
}
