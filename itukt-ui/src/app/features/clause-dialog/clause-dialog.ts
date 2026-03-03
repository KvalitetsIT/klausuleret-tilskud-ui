import { ChangeDetectorRef, Component, inject, Inject, TemplateRef, ViewChild } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatListModule } from "@angular/material/list";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ClauseStatus, ClauseStatusInput, DslOutput } from "@api/index";
import { ClauseDialogService } from "src/app/services/clause-dialog-service";
import { ClausesService } from "src/app/services/clauses";
import { ConfirmationDialogService } from "src/app/services/confirmation-dialog-service";
import { ClauseEditItems } from "./content-items/edit/clause-edit-items";
import { ClauseReadItems } from "./content-items/read/clause-read-items";
import { MatCheckbox, MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule } from "@angular/forms";
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
    ClauseEditItems,
    MatCheckbox,
    MatCheckboxModule,
    FormsModule
  ],
},
)
export class ClauseDialog {
  @ViewChild(ClauseEditItems) editItems?: ClauseEditItems;
  
  private cdr = inject(ChangeDetectorRef);
  private clauseService = inject(ClausesService);
  private clauseDialogService = inject(ClauseDialogService);
  private readonly currentDialogRef = inject(MatDialogRef<ClauseDialog>);
  private confirmationDialogService = inject(ConfirmationDialogService);

  draftClauses = toSignal<Array<DslOutput>>(this.clauseService.getClauses(ClauseStatus.Draft));
  clause: DslOutput;
  status: ClauseStatus;
  editMode = false;
  saving = false;

  @ViewChild('approveTemplate') approveTemplate!: TemplateRef<any>;
  
  context: any = {
    resetSkippedValidations: false
  };

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
    
    this.context.resetSkippedValidations = false;

    this.confirmationDialogService.open(
      `Godkend klausul: ${this.clause.name}`,
      this.approveTemplate,
      this.context,
      () => this.clauseService.approveClause(this.clause, this.context.resetSkippedValidations),
      () => this.currentDialogRef.close(),
      "Godkend"
    );
  }

  draftAlreadyExists(): boolean | undefined {
    return this.draftClauses()?.some(c => c.name === this.clause.name);
  }

  activate() {
    this.confirmationDialogService.open(
      `Aktivér klausul: ${this.clause.name}`, 
      'Er du sikker på at du vil gøre klausulen aktiv?',
      null, 
      () => this.clauseService.updateClauseStatus(this.clause.name, ClauseStatusInput.StatusEnum.Active),
      () => this.currentDialogRef.close(),
      "Ja"
    );
  }

  inactivate() {
    this.confirmationDialogService.open(
      `Inaktivér klausul: ${this.clause.name}`, 
      'Er du sikker på at du vil gøre klausulen inaktiv?', 
      null,
      () => this.clauseService.updateClauseStatus(this.clause.name, ClauseStatusInput.StatusEnum.Inactive),
      () => this.currentDialogRef.close(),
      "Ja"
    );
  }
}
