import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChatService } from "../services/chat-service";
import { SharedModule } from "../shared/shared.module";
import { DialogUserComponent } from "../user-dialog/user-dialog.component";
import { ChatComponent } from "./chat.component";

@NgModule({
  declarations: [ChatComponent, DialogUserComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  providers: [ChatService],
  entryComponents: [DialogUserComponent],
})
export class ChatModule {}
