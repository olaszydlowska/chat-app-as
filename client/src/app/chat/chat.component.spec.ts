import { CommonModule } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ChatService } from "../services/chat-service";
import { SharedModule } from "../shared/shared.module";
import { DialogUserComponent } from "../user-dialog/user-dialog.component";
import { ChatComponent } from "./chat.component";

describe("ChatComponent", () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let chatService: ChatService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatComponent],
      providers: [ChatService],
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
      ],
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [DialogUserComponent],
      },
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    chatService = TestBed.inject(ChatService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("is created", () => {
    expect(component).toBeTruthy();
  });
   
  describe('Message content form control', () => {
    it("is valid when empty", () => {
      const formControl = component.messageContent;
      expect(formControl.valid).toBeTruthy();
      expect(formControl.errors).toBeNull();
    });

    it("is valid when has value", () => {
      const formControl = component.messageContent;
      formControl.setValue("John John");
      expect(formControl.valid).toBeTruthy();
      expect(formControl.errors).toBeNull();
    });

    it("is invalid when max length exceeded", () => { 
      const formControl = component.messageContent;
      formControl.setValue(
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      );
      expect(formControl.valid).toBeFalsy();
    });
  })

  describe('Input element', () => {
    it("render message content input element", () => {
      const compiled = fixture.debugElement.nativeElement;
      const messageinput = compiled.querySelector("input");
      expect(messageinput).toBeTruthy();
    });
  })

  describe('sendMessage() method', () => {

    it("call chatService when messageContent input not empty", () => {
      const formControl = component.messageContent;
      formControl.setValue("John John");
  
      const userServiceSpy = spyOn(chatService, "sendMessage").and.callThrough();
      const componentSpy = spyOn(component, "onSendMessage").and.callThrough();
  
      component.onSendMessage();
  
      expect(userServiceSpy).toHaveBeenCalledTimes(1);
      expect(componentSpy).toHaveBeenCalledTimes(1);
    });

    it("not call chatService when messageContent input is empty", () => {
      const formControl = component.messageContent;
      formControl.setValue("");
  
      const userServiceSpy = spyOn(chatService, "sendMessage").and.callThrough();
      const componentSpy = spyOn(component, "onSendMessage").and.callThrough();
  
      component.onSendMessage();
  
      expect(userServiceSpy).toHaveBeenCalledTimes(0);
      expect(componentSpy).toHaveBeenCalledTimes(1);
    });
  })
});
