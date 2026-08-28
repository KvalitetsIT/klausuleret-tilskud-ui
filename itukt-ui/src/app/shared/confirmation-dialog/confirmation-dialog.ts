import { NgTemplateOutlet } from "@angular/common";
import { Component, inject, Inject, TemplateRef } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { Observable } from "rxjs";

@Component({
  selector: 'confirmation-dialog',
  templateUrl: 'confirmation-dialog.html',
  styleUrl: "confirmation-dialog.css",
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinner, NgTemplateOutlet],
})
export class ConfirmationDialog<T> {
  private currentDialogRef = inject(MatDialogRef<ConfirmationDialog<T>>);
  private onConfirm: () => Observable<T>;
  private onSuccess: (result: T) => void;
  saving = false;
  title: string;
  content: string | TemplateRef<any>;
  confirmBtnTxt: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    title: string,
    content: string | TemplateRef<any>,
    onConfirm: () => Observable<T>,
    onSuccess: (result: T) => void,
    confirmBtnTxt: string
  }) {
    this.title = data.title;
    this.content = data.content;
    this.onConfirm = data.onConfirm;
    this.onSuccess = data.onSuccess;
    this.confirmBtnTxt = data.confirmBtnTxt
  }

  confirm() {
    this.saving = true;
    this.onConfirm()
      .subscribe({
        next: (result) => {
          this.currentDialogRef.close();
          this.saving = false;
          this.onSuccess(result);
        },
        error: (_) => {
          this.saving = false;
        }
      });
  }

  cancel() {
    this.currentDialogRef.close();
  }

  isTemplate(value: any): value is TemplateRef<any> {
    return value instanceof TemplateRef;;
  }

}
