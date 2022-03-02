import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "user-dialog",
  templateUrl: "./user-dialog.component.html",
  styleUrls: ["./user-dialog.component.scss"],
})
export class DialogUserComponent {
  public username = new FormControl("", [Validators.required]);

  constructor(public dialogRef: MatDialogRef<DialogUserComponent>) {
    this.username.markAsTouched();
  }

  public onSave(): void {
    if (this.username.value) {
      this.dialogRef.close(this.username.value);
    }
  }
}
