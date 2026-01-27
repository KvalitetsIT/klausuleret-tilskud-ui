import { ChangeDetectorRef, Component, inject, Inject, ViewChild } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatListModule } from "@angular/material/list";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { ClauseStatus, DslOutput } from "@api/index";
import { ClauseDialogService } from "src/app/services/clause-dialog-service";
import { ClausesService } from "src/app/services/clauses";
import { ClauseEditItems } from "./content-items/edit/clause-edit-items";
import { ClauseReadItems } from "./content-items/read/clause-read-items";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: 'clause-dialog',
  templateUrl: 'clause-dialog.html',
  imports: [
    MatDialogModule,
    MatListModule,
    MatProgressSpinner,
    MatButtonModule,
    MatTooltipModule,
    ClauseReadItems,
    ClauseEditItems
  ],
})
export class ClauseDialog {
  @ViewChild(ClauseEditItems) editItems?: ClauseEditItems;
  private cdr = inject(ChangeDetectorRef);
  private clauseService = inject(ClausesService);
  private clauseDialogService = inject(ClauseDialogService);
  private readonly currentDialogRef = inject(MatDialogRef<ClauseDialog>);
  private matDialog = inject(MatDialog);

  draftClauses = toSignal<Array<DslOutput>>(this.clauseService.getClauses(ClauseStatus.Draft));
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
        next: (clauseDraft) => {
          this.currentDialogRef.close();
          this.saving = false;
          this.clauseDialogService.open(clauseDraft, 'DRAFT');
        },
        error: (_) => {
          this.saving = false;
        }
      });
  }

  approve() {
    this.matDialog.open(ApproveConfirmationDialog, {
      minWidth: '400px',
      data: { clause: this.clause, clauseDialogRef: this.currentDialogRef }
    });
  }

  draftAlreadyExists(): boolean | undefined {
    return this.draftClauses()?.some(c => c.name === this.clause.name);
  }
}

@Component({
  selector: 'approve-confirmation-dialog',
  templateUrl: 'approve-confirmation-dialog.html',
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinner],
})
export class ApproveConfirmationDialog {
  private currentDialogRef = inject(MatDialogRef<ApproveConfirmationDialog>);
  private clauseService = inject(ClausesService);
  private clauseDialogRef: MatDialogRef<ClauseDialog>;
  clause: DslOutput;
  saving = false;

  constructor(@Inject(MAT_DIALOG_DATA) data: { clause: DslOutput, clauseDialogRef: MatDialogRef<ClauseDialog> }) {
    this.clause = data.clause;
    this.clauseDialogRef = data.clauseDialogRef;
  }

  approve() {
    this.saving = true;
    this.clauseService.approveClause(this.clause)
      .subscribe({
        next: () => {
          this.currentDialogRef.close();
          this.clauseDialogRef.close();
          this.saving = false;
        },
        error: (_) => {
          this.saving = false;
        }
      });
  }

  cancel() {
    this.currentDialogRef.close();
  }
}