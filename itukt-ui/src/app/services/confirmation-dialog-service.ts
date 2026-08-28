import { inject, Injectable, TemplateRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs/internal/Observable";
import { ConfirmationDialog } from "../shared/confirmation-dialog/confirmation-dialog";

@Injectable({ providedIn: 'root' })
export class ConfirmationDialogService {
    private matDialog = inject(MatDialog);

    open<T>(title: string, content: string | TemplateRef<any>, context: any, onConfirm: () => Observable<T>, onSuccess: (result: T) => void, confirmBtnTxt: string) {
        this.matDialog.open(ConfirmationDialog<T>, {
            minWidth: '400px',
            data: { title, content, context, onConfirm, onSuccess, confirmBtnTxt},
        });
    }
}
