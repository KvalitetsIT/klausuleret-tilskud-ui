import { DatePipe } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { MatListModule } from "@angular/material/list";
import { DslOutput } from "@api/index";
import { DslHighlightPipe } from "src/app/shared/dsl-highlight-pipe";
import { ClauseField } from "./field/clause-field";

@Component({
    selector: 'clause-dialog',
    templateUrl: 'clause-dialog.html',
    styleUrls: ['clause-dialog.css'],
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatListModule,
        DslHighlightPipe,
        DatePipe,
        ClauseField
    ],
})
export class ClauseDialog {
  clause: DslOutput;

  constructor(@Inject(MAT_DIALOG_DATA) data: { clause: DslOutput }) {
    this.clause = data.clause;
  }
}