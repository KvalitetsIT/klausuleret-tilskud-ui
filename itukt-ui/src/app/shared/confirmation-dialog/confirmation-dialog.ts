import { Component, inject, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { Observable } from "rxjs";

@Component({
  selector: 'confirmation-dialog',
  templateUrl: 'confirmation-dialog.html',
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinner],
})
export class ConfirmationDialog {
  private currentDialogRef = inject(MatDialogRef<ConfirmationDialog>);
  private onConfirm: () => Observable<void>;
  private onSuccess: () => void;
  saving = false;
  title: string;
  message: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: { title: string, message: string, onConfirm: () => Observable<void>, onSuccess: () => void }) {
    this.title = data.title;
    this.message = data.message;
    this.onConfirm = data.onConfirm;
    this.onSuccess = data.onSuccess;
  }

  confirm() {
    this.saving = true;
    this.onConfirm()
      .subscribe({
        next: () => {
          this.currentDialogRef.close();
          this.saving = false;
          this.onSuccess();
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