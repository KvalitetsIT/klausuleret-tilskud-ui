import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatTabsModule } from "@angular/material/tabs";
import { DslOutput } from "@api/index";
import { ClauseHistory } from "../clause-history/clause-history";
import { ClauseInfo } from "../clause-info/clause-info";

@Component({
  standalone: true,
  selector: 'clause-dialog',
  templateUrl: 'clause-dialog.html',
  styleUrls: ['clause-dialog.css'],
  imports: [
    ClauseInfo,
    ClauseHistory,
    MatDialogModule,
    MatTabsModule
],
},
)
export class ClauseDialog {
  clause: DslOutput;

  constructor(@Inject(MAT_DIALOG_DATA) data: { clause: DslOutput }) {
    this.clause = data.clause;
  }
}
