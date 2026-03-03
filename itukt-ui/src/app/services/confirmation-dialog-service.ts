import { inject, Injectable, TemplateRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs/internal/Observable";
import { ConfirmationDialog } from "../shared/confirmation-dialog/confirmation-dialog";

@Injectable({ providedIn: 'root' })
export class ConfirmationDialogService {
    private matDialog = inject(MatDialog);

    open(title: string, content: string | TemplateRef<any>, context: any, onConfirm: () => Observable<void>, onSuccess: () => void, confirmBtnTxt: string) {
        this.matDialog.open(ConfirmationDialog, {
            minWidth: '400px',
            data: { title, content, context, onConfirm, onSuccess, confirmBtnTxt},
        });
    }
}
