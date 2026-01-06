import { Component, Inject, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
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

  clause: DslOutput;
  status: 'DRAFT' | 'ACTIVE';
  editMode = false;

  constructor(@Inject(MAT_DIALOG_DATA) data: { clause: DslOutput, status: 'DRAFT' | 'ACTIVE' }) {
    this.clause = data.clause;
    this.status = data.status;
  }

  enterEditMode() {
    this.editMode = true;
  }

  cancelEditMode() {
    this.editMode = false;
  }

  save() {
    this.editItems?.save();
  }

}