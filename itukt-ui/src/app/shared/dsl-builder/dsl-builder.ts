import { Component, inject, Input } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ClauseService } from 'src/app/services/clause-service';
import { DslHighlightPipe } from '../dsl-highlight-pipe';
import { ExpressionType } from '../expression-types';
import { InputAutocomplete } from '../input-autocomplete/input-autocomplete';
import { Expression } from './expression/expression';

@Component({
    standalone: true,
    selector: 'dsl-builder',
    templateUrl: 'dsl-builder.html',
    styleUrls: ['dsl-builder.css'],
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        Expression,
        MatProgressSpinner,
        MatAutocompleteModule,
        ReactiveFormsModule,
        DslHighlightPipe,
        InputAutocomplete
    ],
})
export class DslBuilder {
    @Input({ required: true }) dslField!: AbstractControl;
    private clauseService = inject(ClauseService);

    ExpressionType = ExpressionType;
    expressionTypes = Object.values(ExpressionType);
    selectedExpressionType: ExpressionType | undefined;

    ageOperators = ['=', '<', '<=', '>=', '>'];
    selectedAgeOperator = this.ageOperators[0];

    departmentSpecialities: Set<string> | undefined;
    atcCodes: Set<string> | undefined;
    formCodes: Set<string> | undefined;
    
    simpleValue = '';
    atcCode = '';
    formCode = '';
    routeCode = '';

    ngOnInit(): void {
        this.clauseService.getDepartmentSpecialities()
            .subscribe({
                next: (departmentSpecialities) => this.departmentSpecialities = departmentSpecialities
            });
        this.clauseService.getMedicationFormCodes()
            .subscribe({
                next: (formCodes) => this.formCodes = formCodes
            });
        this.clauseService.getMedicationAtcCodes()
            .subscribe({
                next: (atcCodes) => this.atcCodes = atcCodes
            });
    }

    dslReadyForExpression(): boolean {
        const dsl = (this.dslField.value as string).trim().toLowerCase();
        return dsl === '' || dsl.endsWith(' eller') || dsl.endsWith(' og');
    }

    appendExistingDrugMedicationExpression = () => {
        const atcValue = this.atcCode != '' ? `ATC = "${this.atcCode}"` : undefined;
        const formValue = this.formCode != '' ? `FORM = "${this.formCode}"` : undefined;
        const routeValue = this.routeCode != '' ? `ROUTE = "${this.routeCode}"` : undefined;
        const values = [atcValue, formValue, routeValue].filter(v => v !== undefined);
        this.append([ExpressionType.EXISTING_DRUG_MEDICATION, "=", `{${values.join(', ')}}`]);
    }

    appendAgeExpression = () => {
        this.appendExpression(this.selectedAgeOperator, this.simpleValue);
    }

    appendSimpleStringExpression = () => {
        this.appendExpression('=', `"${this.simpleValue}"`);
    }

    appendExpression(operator: string, value: string) {
        if (this.selectedExpressionType === undefined) return;
        this.append([this.selectedExpressionType.valueOf(), operator, value]);
    }

    append(values: string[]) {
        const prefix = this.dslField.value ? this.dslField.value + ' ' : '';
        this.dslField.setValue(prefix + values.join(' '));
        this.selectedExpressionType = undefined;
        this.resetOperatorAndValues();
    }

    resetOperatorAndValues() {
        this.selectedAgeOperator = this.ageOperators[0];
        this.formCode = "";
        this.atcCode = "";
        this.routeCode = "";
        this.simpleValue = "";
    }
}