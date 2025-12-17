import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { Component, inject, model } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { DslInput } from "@api/index";

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
    MatDialogClose,
    CdkTextareaAutosize
  ],
})
export class CreateClauseDialog {
  readonly dialogRef = inject(MatDialogRef<CreateClauseDialog>);
  readonly data = inject<DslInput>(MAT_DIALOG_DATA);
  readonly dsl = model(this.data.dsl);
  readonly error = model(this.data.error);

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  create() {
    console.log("Creating clause:", this.dsl(), this.error());
    this.dialogRef.close();
  }
  
}