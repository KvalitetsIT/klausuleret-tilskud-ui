import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { Component, inject } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { ClauseStatus } from "@api/index";
import { ClauseDialogService } from "src/app/services/clause-dialog-service";
import { ClausesService } from "src/app/services/clauses";
import { ClauseValidators } from "src/app/shared/clause-validators";

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
    private clauseValidators = inject(ClauseValidators);
    private fb = inject(FormBuilder)
    private clauseDialogService = inject(ClauseDialogService);

    readonly dialogRef = inject(MatDialogRef<CreateClauseDialog>);
    loading = false;

    form = this.fb.group({
        name: ['',
            [
                Validators.required,
                this.clauseValidators.clauseNameInUseValidator
            ]
        ],
        dsl: ['', Validators.required],
        error: ['', Validators.required]
    });

    onNoClick(): void {
        this.dialogRef.close();
    }

    create() {
        this.loading = true;
        const { name, dsl, error } = this.form.value;
        this.service.createClause({ name: name ?? '', dsl: dsl ?? '', error: error ?? '' })
            .subscribe({
                next: (clauseDraft) => {
                    this.dialogRef.close();
                    this.loading = false;
                    this.clauseDialogService.open(clauseDraft, ClauseStatus.Draft);
                },
                error: (_) => {
                    this.loading = false;
                }
            });
    }
}