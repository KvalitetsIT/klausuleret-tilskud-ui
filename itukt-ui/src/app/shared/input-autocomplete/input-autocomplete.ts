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
export class InputAutocomplete {
    @Input({ required: true }) values!: Set<string>;
    @Input() label?: string;
    @Input() value: string = '';
    @Output() valueChange = new EventEmitter<string>();

    initialMaxOptions = 200;
    maxOptions = this.initialMaxOptions;

    formControl = new FormControl();
    filteredValues: Observable<string[]> | undefined;

    ngOnInit(): void {
        this.formControl.setValue(this.value, { emitEvent: false });
        this.formControl.valueChanges.subscribe(val => {
            this.valueChange.emit(val || '');
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

    private _createFilteredValues(formControl: FormControl, values: Set<string>): Observable<string[]> {
        const options = Array.from(values).sort();
        return formControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '', options)),
        );
    }

    private _filter(value: string, options: string[]): string[] {
        return options
            .filter(option => option.toLowerCase().includes(value.toLowerCase()));
    }
}