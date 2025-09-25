import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'dslHighlight',
  standalone: true
})
export class DslHighlightPipe implements PipeTransform {
  transform(input: string | null | undefined): SafeHtml {
    const src = (input ?? '').toString();
    let out = src;

    // operators
    out = out.replace(/(>=|<=|=|>|<)/gi, '<span class="op">$1</span>');

    // keywords
    out = out.replace(/\b(eller|og)\b/g, '<span class="k">$1</span>');

    // numbers
    out = out.replace(/\b\d+(?:\.\d+)?\b/g, '<span class="num">$&</span>');

    // identifiers
    out = out.replace(/\b[A-Z][A-Z0-9_]*\b/g, '<span class="id">$&</span>');

    // punctuation
    out = out.replace(/[:(),]/g, '<span class="p">$&</span>');

    return out;
  }
}