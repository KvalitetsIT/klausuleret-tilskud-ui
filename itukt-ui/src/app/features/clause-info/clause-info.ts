import { Component, Input, TemplateRef, ViewChild, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckbox, MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogRef } from "@angular/material/dialog";
import { MatListModule } from "@angular/material/list";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ClauseStatus, ClauseStatusInput, DslOutput } from "@api/index";
import { ClauseDialogService } from "src/app/services/clause-dialog-service";
import { ClausesService } from "src/app/services/clauses";
import { ConfirmationDialogService } from "src/app/services/confirmation-dialog-service";
import { ClauseDialog } from "../clause-dialog/clause-dialog";
import { ClauseEditItems } from "./content-items/edit/clause-edit-items";
import { ClauseReadItems } from "./content-items/read/clause-read-items";

@Component({
  standalone: true,
  selector: 'clause-info',
  templateUrl: 'clause-info.html',
  styleUrls: ['clause-info.css'],
  imports: [
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
export class ClauseInfo {
  @Input({ required: true }) clause!: DslOutput;

  @ViewChild(ClauseEditItems) editItems?: ClauseEditItems;
  
  private clauseService = inject(ClausesService);
  private clauseDialogService = inject(ClauseDialogService);
  private readonly currentDialogRef = inject(MatDialogRef<ClauseDialog>);
  private confirmationDialogService = inject(ConfirmationDialogService);

  draftClauses = toSignal<Array<DslOutput>>(this.clauseService.getClauses(ClauseStatus.Draft));
  editMode = false;
  saving = false;

  @ViewChild('approveTemplate') approveTemplate!: TemplateRef<any>;
  resetSkippedValidations = false

  enterEditMode() {
    this.editMode = true;
  }

  cancelEditMode() {
    this.editMode = false;
  }

  save() {
    this.saving = true;
    this.editItems?.save()
      .subscribe({
        next: (clauseDraft) => {
          this.currentDialogRef.close();
          this.saving = false;
          this.clauseDialogService.open(clauseDraft);
        },
        error: (_) => {
          this.saving = false;
        }
      });
  }

  approve() {
    this.confirmationDialogService.open(
      `Godkend klausul: ${this.clause.name}`,
      this.approveTemplate,
      this.resetSkippedValidations,
      () => this.clauseService.approveClause(this.clause, this.resetSkippedValidations),
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
