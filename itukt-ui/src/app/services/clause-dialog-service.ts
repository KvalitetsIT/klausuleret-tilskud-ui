import { inject, Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ClauseStatus, DslOutput } from "@api/index";
import { ClauseDialog } from "../features/clause-dialog/clause-dialog";

@Injectable({ providedIn: 'root' })
export class ClauseDialogService {
    private clauseDialog = inject(MatDialog);

    open(clause: DslOutput, status: ClauseStatus): MatDialogRef<ClauseDialog, any> {
        return this.clauseDialog.open(ClauseDialog, {
            minWidth: '700px',
            maxWidth: '1500px',
            data: { clause: clause, status: status }
        });
    }
}