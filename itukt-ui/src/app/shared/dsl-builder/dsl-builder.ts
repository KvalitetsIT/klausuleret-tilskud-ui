import { Component, Input } from '@angular/core';
import { Expression } from './expression/expression';
import { AbstractControl, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DslHighlightPipe } from '../dsl-highlight-pipe';

@Component({
    standalone: true,
    selector: 'dsl-builder',
    templateUrl: 'dsl-builder.html',
    styleUrls: ['dsl-builder.css'],
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        DslHighlightPipe,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        Expression
    ],
})
export class DslBuilder {
    @Input({ required: true }) dslField!: AbstractControl;

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
    }
}