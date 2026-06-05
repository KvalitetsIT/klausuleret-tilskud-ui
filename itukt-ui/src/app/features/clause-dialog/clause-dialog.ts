import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatTabsModule } from "@angular/material/tabs";
import { ClauseStatus, DslOutput } from "@api/index";
import { ClauseInfo } from "../clause-info/clause-info";
import { ClauseHistory } from "../clause-history/clause-history";

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
  status: ClauseStatus;

  constructor(@Inject(MAT_DIALOG_DATA) data: { clause: DslOutput, status: ClauseStatus }) {
    this.clause = data.clause;
    this.status = data.status;
  }
}
