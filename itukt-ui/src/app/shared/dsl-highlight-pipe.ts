import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'dslHighlight',
  standalone: true
})
export class DslHighlightPipe implements PipeTransform {
  transform(input: string | null | undefined): SafeHtml {
    const src = (input ?? '').toString();
    let out = src.toUpperCase();

    // numbers
    out = out.replace(/\b\d+(?:\.\d+)?\b/g, '<span class="dsl-number">$&</span>');

    // identifiers
    out = out.replace(/\b(ALDER|INDIKATION|LÆGESPECIALE|AFDELINGSSPECIALE|EKSISTERENDE_LÆGEMIDDEL|FORM|ATC|ROUTE)\b/g, '<span class="dsl-id">$&</span>');

    // keywords
    out = out.replace(/\b(ELLER|OG|I)\b/g, '<span class="dsl-keyword">$1</span>');

    return out;
  }
}