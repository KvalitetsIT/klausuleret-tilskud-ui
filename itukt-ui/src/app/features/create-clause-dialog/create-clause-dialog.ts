import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { Component, inject, model } from "@angular/core";
import { FormsModule } from "@angular/forms";
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
    ],
})
export class CreateClauseDialog {
    private service = inject(ClausesService);

    readonly dialogRef = inject(MatDialogRef<CreateClauseDialog>);
    readonly data = inject<DslInput>(MAT_DIALOG_DATA);
    readonly dsl = model(this.data.dsl);
    readonly error = model(this.data.error);
    loading = false;

    onNoClick(): void {
        this.dialogRef.close();
    }

    create() {
        this.loading = true;
        this.service.createClause({ dsl: this.dsl(), error: this.error() })
            .subscribe({
                next: (result) => {
                    console.log('Clause created:', result);
                    this.dialogRef.close();
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error creating clause:', err);
                    this.loading = false;
                }
            });
    }

}