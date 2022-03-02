import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatList, MatListItem } from "@angular/material/list";
import { Subject } from "rxjs";
import { take, takeUntil, takeWhile } from "rxjs/operators";
import { Action, Message, User } from "../models/models";
import { ChatService } from "../services/chat-service";
import { randomIdGenerator } from "../shared/helpers";
import { DialogUserComponent } from "../user-dialog/user-dialog.component";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  public actionEnum = Action;
  public user: User;
  public messages: Array<Message> = new Array<Message>();
  public messageContent = new FormControl("", [Validators.maxLength(200)]);
  public numberOfUsers = 0;
  public usersTyping = "";
  private isInitialized = false;
  private dialogRef: MatDialogRef<DialogUserComponent> | null = null;
  private usersTypingCollection: string[] = [];
  private _onDestroy = new Subject<void>();
  private typingTimeout: ReturnType<typeof setTimeout> | null = null;

  @ViewChild(MatList, { read: ElementRef, static: true })
  matList!: ElementRef;

  @ViewChildren(MatListItem, { read: ElementRef })
  matListItems!: QueryList<MatListItem>;

  constructor(private chatService: ChatService, public dialog: MatDialog) {
    this.isInitialized = true;

    this.user = {
      Id: randomIdGenerator(),
      Name: "",
    };
  }

  public ngOnInit(): void {
    this.messageContent.markAsTouched();
    this.openUserDialog();
  }

  public ngAfterViewInit(): void {
    this.matListItems?.changes
      .pipe(
        takeWhile(() => this.isInitialized),
        takeUntil(this._onDestroy)
      )
      .subscribe(() => {
        this.scrollToBottom();
      });
  }

  public ngOnDestroy(): void {
    this.isInitialized = false;
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  public onSendMessage(): void {
    if (!this.messageContent.value || this.messageContent.invalid) {
      return;
    } else {
      const serviceMessage: Message = {
        User: this.user,
        MessageContent: this.messageContent.value,
        Action: this.actionEnum.MESSAGE,
      };

      this.chatService.sendMessage(serviceMessage);
      this.onStopTyping();

      this.messageContent.patchValue(null);
    }
  }

  public onTyping(): void {
    this.chatService.typing(this.user);
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    this.typingTimeout = setTimeout(this.onStopTyping.bind(this), 2000);
  }

  private onStopTyping(): void {
    this.chatService.stopTyping(this.user);
  }

  private connectToService(): void {
    this.chatService
      .onMessage()
      .pipe(
        takeWhile(() => this.isInitialized),
        takeUntil(this._onDestroy)
      )
      .subscribe((message: Message) => {
        this.messages.push(message);
      });

    this.chatService
      .onDisconnected()
      .pipe(
        takeWhile(() => this.isInitialized),
        takeUntil(this._onDestroy)
      )
      .subscribe((user: User) => {
        const message: Message = {
          User: user,
          Action: this.actionEnum.LEFT,
        };
        this.messages.push(message);
      });

    this.chatService
      .onGetUsersCount()
      .pipe(
        takeWhile(() => this.isInitialized),
        takeUntil(this._onDestroy)
      )
      .subscribe((data: number) => {
        this.numberOfUsers = data;
      });

    this.chatService
      .onTyping()
      .pipe(
        takeWhile(() => this.isInitialized),
        takeUntil(this._onDestroy)
      )
      .subscribe((user: User) => {
        if (!this.usersTypingCollection.includes(user.Name)) {
          this.usersTypingCollection.push(user.Name);

          if (this.usersTypingCollection.length > 1) {
            this.usersTyping = this.usersTypingCollection.join(",");
          } else {
            this.usersTyping = this.usersTypingCollection[0];
          }
        }
      });

    this.chatService
      .onStopTyping()
      .pipe(
        takeWhile(() => this.isInitialized),
        takeUntil(this._onDestroy)
      )
      .subscribe((user: User) => {
        if (this.usersTypingCollection.includes(user.Name)) {
          this.usersTypingCollection = this.usersTypingCollection.filter(
            (u: string) => u !== user.Name
          );

          if (this.usersTypingCollection.length > 1) {
            this.usersTyping = this.usersTypingCollection.join(",");
          } else if (this.usersTypingCollection.length === 1) {
            this.usersTyping = this.usersTypingCollection[0];
          } else {
            this.usersTyping = "";
          }
        }
      });
  }
  private openUserDialog(): void {
    this.dialogRef = this.dialog.open(DialogUserComponent, {
      disableClose: true,
    });

    this.dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((dialogResult: string) => {
        if (!dialogResult) {
          return;
        } else {
          this.user.Name = dialogResult;

          const message: Message = {
            User: this.user,
            Action: this.actionEnum.JOINED,
          };

          this.connectToService();
          this.chatService.sendMessage(message);
          this.chatService.connectedUser(this.user);
        }
      });
  }

  private scrollToBottom(): void {
    try {
      this.matList.nativeElement.scrollTop =
        this.matList.nativeElement.scrollHeight;
    } catch (error) {
      console.error("An error occurred", error);
    }
  }
}
