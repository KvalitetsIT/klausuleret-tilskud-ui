import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { map, startWith } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Component({
    standalone: true,
    selector: 'input-autocomplete',
    templateUrl: 'input-autocomplete.html',
    styleUrls: ['input-autocomplete.css'],
    imports: [
        MatButtonModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        MatAutocompleteModule,
        AsyncPipe,
        ReactiveFormsModule,
    ],
})
export class InputAutocomplete<T> {
    @Input({ required: true }) values!: T[];
    @Input() label?: string;
    @Input() value: T | string | undefined = undefined;
    @Input() renderOption: (option?: T) => string = (option?: T) => option ? String(option) : '';
    @Output() valueChange = new EventEmitter<T | undefined>();

    initialMaxOptions = 200;
    maxOptions = this.initialMaxOptions;

    formControl = new FormControl();
    filteredValues: Observable<T[]> | undefined;

    ngOnInit(): void {
        this.formControl.setValue(this.value, { emitEvent: false });
        this.formControl.valueChanges.subscribe(val => {
            this.valueChange.emit(val || undefined);
            this.maxOptions = this.initialMaxOptions;
        });
        this.filteredValues = this._createFilteredValues(this.formControl, this.values)
    }

    showMoreOptions() {
        this.maxOptions += this.maxOptions;
    }

    onInputBlur() {
        this.maxOptions = this.initialMaxOptions;
    }

    private _createFilteredValues(formControl: FormControl, values: T[]): Observable<T[]> {
        return formControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '', values)),
        );
    }

    private _filter(value: T | string | undefined, options: T[]): T[] {
        const stringValue = value === undefined ? '' : (typeof value === 'string' ? value : this.renderOption(value));
        return options
            .filter(option => this.renderOption(option).toLowerCase().includes(stringValue.toLowerCase()));
    }
}