import {
  Attribute,
  Component,
  Input,
  Pipe,
  PipeTransform,
} from '@angular/core';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { SYMBOLS_SVG } from '../app.constants';

import { Rank, Symbol } from '../app.models';

@Pipe({
  name: 'safe',
})
export class SafePipe implements PipeTransform {
  constructor(protected sanitizer: DomSanitizer) {}

  public transform(value: any): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() public symbol: Symbol;
  @Input() public rank: Rank;

  public SYMBOLS = SYMBOLS_SVG;

  constructor() // @Attribute('rank') public rank: Rank // @Attribute('symbol') public symbol: Symbol,
  {
    this.symbol = 'C';
    this.rank = 'A';
  }
}
