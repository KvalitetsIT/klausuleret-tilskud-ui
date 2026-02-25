import { Inject, inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs/internal/Observable";
import { ConfirmationDialog } from "../shared/confirmation-dialog/confirmation-dialog";

@Injectable({ providedIn: 'root' })
export class ConfirmationDialogService {
    private matDialog = inject(MatDialog);

    open(title: string, message: string, onConfirm: () => Observable<void>, onSuccess: () => void) {
        this.matDialog.open(ConfirmationDialog, {
            minWidth: '400px',
            data: { title, message, onConfirm, onSuccess }
        });
    }
}