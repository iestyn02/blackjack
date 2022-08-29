import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { map, Observable, Subject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';

import * as actions from './@ngrx/actions';

import { State } from './@ngrx/state';

import { fadeAnimation } from './app.animations';

@Component({
  selector: 'app-root',
  animations: [fadeAnimation],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  // ngOnInit() {
  //     this.booksService.getBooks()
  //         .pipe(
  //            startWith([]),
  //            filter(books => books.length > 0),
  //         )
  //         .subscribe(books => console.log(books));

  //     this.booksService.getArchivedBooks()
  //         .pipe(takeUntil(this.ngUnsubscribe))
  //         .subscribe(archivedBooks => console.log(archivedBooks));
  // }

  // ngOnDestroy() {
  //     this.ngUnsubscribe.next();
  //     this.ngUnsubscribe.complete();

  @HostListener('document:keyup', ['$event']) onKeyupHandler(e: KeyboardEvent) {
    switch (e.key.toUpperCase()) {
      /** @hit */
      /** @stay */
      case 'A':
        this.keyEventHanlder();
        break;
      case 'S':
        this.keyEventHanlder();
        // this.store.dispatch({
        //   type: actions.SET_MODAL_PROPS,
        //   props: {
        //     show: true,
        //   },
        // });
        break;
      default:
        break;
    }
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(
    e: KeyboardEvent
  ) {
    switch (e.key.toUpperCase()) {
      case 'ESCAPE':
        this.store.dispatch({
          type: actions.SET_MODAL_PROPS,
          props: {
            show: false,
          },
        });
        break;
      /** @hit */
      /** @stay */
      case 'A':
        this.addCard();
        this.keyEventHanlder('keydown', e.key);
        break;
      case 'S':
        this.keyEventHanlder('keydown', e.key);
        this.stay();
        break;
      default:
        break;
    }
  }

  public state$: Observable<State['_']> = this.store.pipe(
    map((state: State) => state._)
  );

  constructor(private store: Store<State>) {}

  private subscribe = new Subject<void>();

  private keyEventHanlder(
    action: 'keyup' | 'keydown' = 'keyup',
    character?: string
  ): void {
    switch (action) {
      case 'keyup':
        this.store.dispatch({
          type: actions.PATCH_KEYS_PROPS,
          props: {
            currentPressed: null,
          },
        });
        break;
      case 'keydown':
        this.store.dispatch({
          type: actions.PATCH_KEYS_PROPS,
          props: {
            currentPressed: (character || '').toUpperCase(),
          },
        });
        break;
    }
  }

  private addCard(identity: 'player' | 'dealer' = 'player'): void {
    this.store.dispatch({
      type: actions.ADD_CARD,
      identity,
    });
  }

  public stay(): void {
    this.addCard('dealer');
    this.store
      .select('_')
      .pipe(
        map((state) => state.game),
        takeUntil(this.subscribe)
      )
      .subscribe((state: State['_']['game']) => {
        if (state.hand.dealer.length < 3) {
          this.addCard('dealer');

          if (state.score.dealer < 17) {
            setTimeout(() => {
              this.addCard('dealer');
            }, 200);
          }
        }
      });
  }

  public toggle(show: boolean = true): void {
    this.store.dispatch({
      type: actions.SET_MODAL_PROPS,
      props: {
        show,
      },
    });
  }

  public ngOnInit(): void {
    this.addCard('player');
    this.addCard('dealer');
    this.addCard('player');
  }

  public ngOnDestroy(): void {
    this.subscribe.next();
    this.subscribe.complete();
  }
}
