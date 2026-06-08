import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ClauseStatus } from '@api/model/models';

@Pipe({
  name: 'statusTranslate',
  standalone: true
})
export class StatusTranslatePipe implements PipeTransform {
  transform(input: ClauseStatus): SafeHtml {
    switch (input) {
      case ClauseStatus.Active:
        return 'Aktiv';
      case ClauseStatus.Inactive:
        return 'Inaktiv';
      case ClauseStatus.Draft:
        return 'Kladde';
    }
  }
}