import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'dslHighlight',
  standalone: true
})
export class DslHighlightPipe implements PipeTransform {
  transform(input: string | null | undefined): SafeHtml {
    const src = (input ?? '').toString();

    const identifierRegex = '\\b(ALDER|INDIKATION|LÆGESPECIALE|AFDELINGSSPECIALE|EKSISTERENDE_LÆGEMIDDEL|FORM|ATC|ROUTE)\\b';
    const numberRegex = '\\b(\\d+)\\b';
    const stringRegex = '("[^\\"]*")';
    const keywordRegex = '\\b(eller|og|i)\\b';
    const regex = [identifierRegex, numberRegex, stringRegex, keywordRegex].join('|');

    return src.replace(new RegExp(regex, 'g'),
      (match, id, num, str, keyword) => {
        if (id) return `<span class="dsl-id">${id}</span>`;
        if (num) return `<span class="dsl-number">${num}</span>`;
        if (str) return `<span class="dsl-string">${str}</span>`;
        if (keyword) return `<span class="dsl-keyword">${keyword}</span>`;
        return match;
      }
    );
  }
}