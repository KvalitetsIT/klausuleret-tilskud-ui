import { Component, inject, Inject, ViewChild, ChangeDetectorRef } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatListModule } from "@angular/material/list";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { DslOutput } from "@api/index";
import { ClauseReadItems } from "./content-items/read/clause-read-items";
import { ClauseEditItems } from "./content-items/edit/clause-edit-items";

@Component({
  selector: 'clause-dialog',
  templateUrl: 'clause-dialog.html',
  styleUrls: ['clause-dialog.css'],
  imports: [
    MatDialogModule,
    MatListModule,
    MatProgressSpinner,
    MatButtonModule,
    ClauseReadItems,
    ClauseEditItems
  ],
})
export class ClauseDialog {
  @ViewChild(ClauseEditItems) editItems?: ClauseEditItems;
  private cdr = inject(ChangeDetectorRef);
  readonly dialogRef = inject(MatDialogRef<ClauseDialog>);

  clause: DslOutput;
  status: 'DRAFT' | 'ACTIVE';
  editMode = false;
  saving = false;

  constructor(@Inject(MAT_DIALOG_DATA) data: { clause: DslOutput, status: 'DRAFT' | 'ACTIVE' }) {
    this.clause = data.clause;
    this.status = data.status;
  }

  enterEditMode() {
    this.editMode = true;
    this.cdr.detectChanges();
  }

  cancelEditMode() {
    this.editMode = false;
    this.cdr.detectChanges();
  }

  save() {
    this.saving = true;
    this.editItems?.save()
      .subscribe({
        next: (_) => {
          this.dialogRef.close();
          this.saving = false;
        },
        error: (_) => {
          this.saving = false;
        }
      });
  }

}