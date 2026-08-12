import { Directive, HostListener, inject } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: "textarea[appUppercase],input[appUppercase]",
  standalone: true,
})
export class UppercaseDirective {
  private ngControl = inject(NgControl, { optional: true });

  @HostListener("input", ["$event"])
  onInput(event: Event): void {
    const element = event.target as HTMLTextAreaElement | HTMLInputElement;
    element.value = element.value.toUpperCase();

    this.ngControl?.control?.setValue(element.value, { emitEvent: false });
  }
}