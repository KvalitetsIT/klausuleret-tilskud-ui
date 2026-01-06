import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'clause-field',
  templateUrl: 'clause-field.html',
  styleUrls: ['clause-field.css'],
  imports: [MatListModule],
})
export class ClauseField {
  @Input() label!: string;
}