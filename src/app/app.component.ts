import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { map, Observable, Subject } from 'rxjs';

import { tap } from 'rxjs/operators';

import * as actions from './@ngrx/actions';

import { State } from './@ngrx/state';

import { fadeAnimation } from './app.animations';

export const ANIMATION_SPEED = 200;
@Component({
  selector: 'app-root',
  animations: [fadeAnimation],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  @HostListener('document:keyup', ['$event']) onKeyupHandler(e: KeyboardEvent) {
    switch (e.key.toUpperCase()) {
      /** @hit */
      /** @stay */
      case 'A':
        this.keyEventHanlder();
        break;
      case 'S':
        this.keyEventHanlder();
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
      case 'A':
        if (
          this._state &&
          !this._state.game.finish &&
          this._state.game.score.player < 21
        ) {
          this.addCard();
        }
        this.keyEventHanlder('keydown', e.key);
        break;
      /** @stay */
      case 'S':
        this.keyEventHanlder('keydown', e.key);
        this.stay();
        break;
      default:
        break;
    }
  }

  public state$: Observable<State['_']> = this.store.pipe(
    tap((state: State) => (this._state = state._)),
    map((state: State) => state._)
  );

  constructor(private store: Store<State>) {}

  public _state: State['_'] | undefined;

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

  private addCard(
    identity: 'player' | 'dealer' = 'player',
    end?: boolean
  ): void {
    this.store.dispatch({
      type: actions.ADD_CARD,
      identity,
      end,
    });
  }

  public stay(): void {
    if (this._state && !this._state.game.finish) {
      this.addCard('dealer', true);
      setTimeout(() => {
        if (this._state && this._state.game.score.dealer < 17) {
          this.addCard('dealer', true);
        }
      }, ANIMATION_SPEED);
    }
  }

  public toggle(show: boolean = true): void {
    this.store.dispatch({
      type: actions.SET_MODAL_PROPS,
      props: {
        show,
      },
    });
  }

  private determineIfWin(
    playerScore: number,
    dealerScore: number
  ): 'B' | 'L' | 'W' | 'D' {
    if (playerScore > 21) {
      return 'B';
    } else if (dealerScore > 21) {
      return 'W';
    } else if (playerScore > dealerScore) {
      return 'W';
    } else if (dealerScore > playerScore) {
      return 'L';
    } else {
      return 'D';
    }
  }

  public gameStatus(playerScore: number, dealerScore: number): string {
    switch (this.determineIfWin(playerScore, dealerScore)) {
      case 'B':
        return 'Bust!';
      case 'W':
        return 'You Win';
      case 'L':
        return 'You Lose';
      default:
        return 'Draw';
    }
  }

  public init(): void {
    const add = (i: number) => {
      if (i % 2) {
        this.addCard('dealer');
      } else {
        this.addCard('player');
      }
    };

    for (let i = 0; i < 3; i++) {
      add(i);
    }
  }

  public ngOnInit(): void {
    this.init();
  }

  public ngOnDestroy(): void {}
}
