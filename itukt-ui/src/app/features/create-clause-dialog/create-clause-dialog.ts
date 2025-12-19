import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { Component, inject, model } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { DslInput } from "@api/index";
import { ClausesService } from "src/app/services/clauses";

@Component({
    selector: 'create-clause-dialog',
    templateUrl: 'create-clause-dialog.html',
    styleUrls: ['create-clause-dialog.css'],
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        CdkTextareaAutosize,
        MatProgressSpinner,
        ReactiveFormsModule,
    ],
})
export class CreateClauseDialog {
    private service = inject(ClausesService);
    private fb = inject(FormBuilder)

    readonly dialogRef = inject(MatDialogRef<CreateClauseDialog>);
    loading = false;

    form = this.fb.group({
      dsl: ['', Validators.required],
      error: ['', Validators.required]
    });

    onNoClick(): void {
        this.dialogRef.close();
    }

    create() {
        this.loading = true;
        const { dsl, error } = this.form.value;
        this.service.createClause({ dsl: dsl ?? '', error: error ?? '' })
            .subscribe({
                next: (_) => {
                    this.dialogRef.close();
                    this.loading = false;
                },
                error: (_) => {
                    this.loading = false;
                }
            });
    }

}