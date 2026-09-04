import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { Component, inject } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { DslTooltip } from "src/app/shared/dsl-tooltip/dsl-tooltip";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { ClauseDialogService } from "src/app/services/clause-dialog-service";
import { ClauseService } from "src/app/services/clause-service";
import { HttpErrorResponse } from "@angular/common/http";
import { ClauseValidators } from "src/app/shared/clause-validators";
import { DrugsCountChip } from "src/app/shared/drugs-count-chip/drugs-count-chip";
import { ConfirmationDialogService } from "src/app/services/confirmation-dialog-service";
import { DetailedError, DslOutput } from "@api/model/models";
import { DslBuilder } from "src/app/shared/dsl-builder/dsl-builder";
import { MatIconModule } from "@angular/material/icon";

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
        DrugsCountChip,
        DslTooltip,
        DslBuilder,
        MatIconModule
    ],
})
export class CreateClauseDialog {
    private service = inject(ClauseService);
    private clauseValidators = inject(ClauseValidators);
    private fb = inject(FormBuilder)
    private clauseDialogService = inject(ClauseDialogService);
    private confirmationDialogService = inject(ConfirmationDialogService);

    readonly dialogRef = inject(MatDialogRef<CreateClauseDialog>);
    loading = false;
    name = '';
    editMode = false;

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

    editModeOnOff() {
        this.editMode = !this.editMode;
        console.log('Edit mode is now', this.editMode);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onNameBlur(): void {
        this.name = this.form.get('name')?.value ?? '';
    }

    tryCreate(skipValidation: boolean) {
        const { name, dsl, error } = this.form.value;
        return this.service.createClause({ name: name ?? '', dsl: dsl ?? '', error: error ?? '' }, skipValidation);
    }

    create() {
        this.loading = true;
        this.tryCreate(false)
            .subscribe({
                next: (clauseDraft) => {
                    this.onCreateSuccess(clauseDraft);
                },
                error: (e: HttpErrorResponse) => {
                    this.loading = false;
                    const detailedError = e.error as DetailedError;
                    if (detailedError?.detailed_error_code === DetailedError.DetailedErrorCodeEnum.Validation) {
                        this.openConfirmDialog();
                    }
                }
            });
    }

    onCreateSuccess(draft: DslOutput) {
        this.dialogRef.close();
        this.loading = false;
        this.clauseDialogService.open(draft);
    }

    openConfirmDialog() {
        this.confirmationDialogService.open(
            "Validering fejlede",
            "Vil du oprette klausulen alligevel?",
            undefined,
            () => this.tryCreate(true),
            (result) => this.onCreateSuccess(result),
            "Ja"
        );
    }
}