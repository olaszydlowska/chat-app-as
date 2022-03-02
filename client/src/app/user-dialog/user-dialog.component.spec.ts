import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { MatDialogRef } from "@angular/material/dialog";
import { By } from "@angular/platform-browser";
import { DialogUserComponent } from "./user-dialog.component";

describe("UserDialogComponent", () => {
  let component: DialogUserComponent;
  let fixture: ComponentFixture<DialogUserComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DialogUserComponent],
      providers: [{ provide: MatDialogRef, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("is created", () => {
    expect(component).toBeTruthy();
  });

  describe('Username form control', () => {
    it("is invalid when empty", () => {
      const formControl = component.username;
      expect(formControl.valid).toBeFalsy();
      expect(formControl.errors).toBeTruthy();
    });

    it("is valid when has value", () => {
      const formControl = component.username;
      formControl.setValue("John");
      expect(formControl.valid).toBeTruthy();
      expect(formControl.errors).toBeNull();
    });
  })

  describe('Input element', () => {
    it("render username input element", () => {
      const compiled = fixture.debugElement.nativeElement;
      const messageinput = compiled.querySelector("input");
      expect(messageinput).toBeTruthy();
    });
  })

  describe('onSave() method', () => {
    it("call onSave() on button click", fakeAsync(() => {
      fixture.detectChanges();
      spyOn(component, "onSave");
      let btn = fixture.debugElement.query(By.css("button"));
      btn.triggerEventHandler("click", null);
      tick();
      fixture.detectChanges();
      expect(component.onSave).toHaveBeenCalled();
    }));
  })
});
