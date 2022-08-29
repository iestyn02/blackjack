import { createReducer, on } from '@ngrx/store';

import { State } from './state';

import * as actions from './actions';

import { Rank, Symbol } from '../app.models';

import { SymbolMap } from '../app.constants';

export const init: State['_'] = {
  modal: { show: false },
  keys: { lastPressed: null, currentPressed: null },
  game: {
    finish: false,
    score: {
      dealer: 0,
      player: 0,
    },
    hand: {
      dealer: [],
      player: [],
    },
  },
};

export const reducer = createReducer(
  init,
  on(actions.setModalProps, (state, { props }) => ({
    ...state,
    modal: props,
  })),
  on(actions.patchKeyProps, (state, { props }) => ({
    ...state,
    keys: {
      ...state.keys,
      ...props,
    },
  })),
  on(actions.addCard, (state, { identity }) => {
    const _state = {
      ...state,
      game: {
        finish: false,
        hand: {
          player: state.game.hand.player.map((_) => _),
          dealer: state.game.hand.dealer.map((_) => _),
        },
        score: {
          player: state.game.score.player,
          dealer: state.game.score.dealer,
        },
      },
    } as State['_'];

    let rank: Rank;
    let symbol: Symbol;
    let looping: boolean = true;

    while (
      state.game.hand['dealer']
        .concat(state.game.hand['player'])
        .findIndex(
          (item: { rank: Rank; symbol: Symbol }) =>
            item.rank === rank && item.symbol === symbol
        ) === -1 &&
      looping &&
      state.game.score[identity] < 21
    ) {
      const rand = Math.floor(Math.random() * 13) + 1;

      symbol = SymbolMap[
        Math.floor(Math.random() * 4) + 1
      ] as unknown as Symbol;

      switch (rand) {
        case 13:
          rank = 'K';
          break;
        case 12:
          rank = 'Q';
          break;
        case 11:
          rank = 'J';
          break;
        case 1:
          rank = 'A';
          break;
        default:
          rank = `${rand}` as Rank;
          break;
      }

      if (
        !state.game.finish &&
        state.game.hand['dealer']
          .concat(state.game.hand['player'])
          .findIndex(
            (item: { rank: Rank; symbol: Symbol }) =>
              item.rank === rank && item.symbol === symbol
          ) === -1
      ) {
        looping = false;

        if (['K', 'Q', 'J'].includes(rank)) {
          _state.game.score[identity] += 10;
        } else if (rank === 'A') {
          _state.game.score[identity] =
            _state.game.score[identity] + 11 > 21
              ? _state.game.score[identity] + 1
              : _state.game.score[identity] + 11;
        } else {
          _state.game.score[identity] += rand;
        }

        _state.game.hand[identity].push({
          rank,
          symbol,
        });
      } else {
        looping = false;
      }
    }

    if (identity === 'dealer' && _state.game.hand['dealer'].length >= 3) {
      _state.game.finish = true;
    }

    return _state;
  })
);
