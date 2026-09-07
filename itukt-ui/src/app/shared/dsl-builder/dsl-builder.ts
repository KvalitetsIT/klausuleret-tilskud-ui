import { Component, Input } from '@angular/core';
import { AbstractControl, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ExpressionType } from '../expression-types';
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
    ],
})
export class DslBuilder {
    @Input({ required: true }) dslField!: AbstractControl;

    ExpressionType = ExpressionType;
    expressionTypes = Object.values(ExpressionType);
    selectedExpressionType: ExpressionType | undefined;

    operators = ['=', '<', '<=', '>=', '>'];
    selectedOperator = this.operators[0];
    value = "";

    appendExpression = () => {
        if(this.selectedExpressionType === undefined) return;

        this.append([this.selectedExpressionType.valueOf(), this.selectedOperator, this.value]);
        this.selectedExpressionType = undefined;
        this.resetOperatorAndValue();
    }

    append(values: string[]) {
        const prefix = this.dslField.value ? this.dslField.value + ' ' : '';
        this.dslField.setValue(prefix + values.join(' '));
    }

    resetOperatorAndValue() {
        this.selectedOperator = this.operators[0];
        this.value = "";
    }
}