import { ChangeDetectorRef, Component, inject, Inject, ViewChild } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatListModule } from "@angular/material/list";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { ClauseStatus, ClauseStatusInput, DslOutput } from "@api/index";
import { ClauseDialogService } from "src/app/services/clause-dialog-service";
import { ClausesService } from "src/app/services/clauses";
import { ClauseEditItems } from "./content-items/edit/clause-edit-items";
import { ClauseReadItems } from "./content-items/read/clause-read-items";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ConfirmationDialog } from "../confirmation-dialog/confirmation-dialog";

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
  status: ClauseStatus;
  editMode = false;
  saving = false;

  constructor(@Inject(MAT_DIALOG_DATA) data: { clause: DslOutput, status: ClauseStatus }) {
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
          this.clauseDialogService.open(clauseDraft, ClauseStatus.Draft);
        },
        error: (_) => {
          this.saving = false;
        }
      });
  }

  approve() {
    this.matDialog.open(ConfirmationDialog, {
      minWidth: '400px',
      data: { 
        title: `Godkend klausul: ${this.clause.name}`, 
        message: 'Er du sikker på at du vil gøre klausulen aktiv?', 
        onConfirm: () => this.clauseService.approveClause(this.clause), 
        onSuccess: () => this.currentDialogRef.close() 
      }
    });
  }

  draftAlreadyExists(): boolean | undefined {
    return this.draftClauses()?.some(c => c.name === this.clause.name);
  }

  updateStatus(newStatus: ClauseStatusInput.StatusEnum) {
    this.saving = true;
    this.clauseService.updateClauseStatus(this.clause.name, newStatus)
      .subscribe({
        next: () => {
          this.currentDialogRef.close();
          this.saving = false;
        },
        error: (_) => {
          this.saving = false;
        }
      });
  }
}