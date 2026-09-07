import { Component, Input } from '@angular/core';
import { AbstractControl, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Expression } from './expression/expression';
import { ExpressionType } from '../expression-types';

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
    ],
})
export class DslBuilder {
    @Input({ required: true }) dslField!: AbstractControl;

    expressionTypes = Object.values(ExpressionType);
    selectedExpressionType: ExpressionType | undefined;

    ageOperators = ['=', '<', '<=', '>=', '>'];
    selectedAgeOperator = this.ageOperators[0];
    selectedAgeValue = "";

    selectedIndicationValue = "";

    selectedDoctorSpecialityValue = "";

    appendAge = () => {
        this.append(['ALDER', this.selectedAgeOperator, this.selectedAgeValue]);
    }

    appendIndication = () => {
        this.append(['INDIKATION =', this.selectedIndicationValue]);
    }

    appendDoctorSpeciality = () => {
        this.append(['LÆGESPECIALE =', this.selectedDoctorSpecialityValue]);
    }

    append(values: string[]) {
        const prefix = this.dslField.value ? this.dslField.value + ' ' : '';
        this.dslField.setValue(prefix + values.join(' '));
        this.selectedExpressionType = undefined;
    }
}