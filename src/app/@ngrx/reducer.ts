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
    balance: 1000,
    stake: 10,
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
  on(actions.setBet, (state, { bet }) => ({
    ...state,
    game: {
      ...state.game,
      stake: bet,
    },
  })),
  on(actions.resetGame, (state) => ({
    ...state,
    game: {
      ...state.game,
      finish: false,
      hand: {
        player: [],
        dealer: [],
      },
      score: {
        player: 0,
        dealer: 0,
      },
    },
  })),
  on(actions.addCard, (state, { identity, end }) => {
    const _state = {
      ...state,
      game: {
        ...state.game,
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
      looping
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

    /** @note ~ determining if game has ended */

    if (_state.game.score.player > 21) {
      _state.game.balance = _state.game.balance - _state.game.stake;
      _state.game.finish = true;
    } else if (_state.game.score.dealer > 21) {
      _state.game.balance = _state.game.balance + _state.game.stake;
      _state.game.finish = true;
    } else if (_state.game.score.player === 21) {
      _state.game.finish = true;
      _state.game.balance = _state.game.balance + _state.game.stake / 2;
    } else if (
      end &&
      (!(_state.game.score.dealer < 17) || _state.game.hand.dealer.length === 3)
    ) {
      _state.game.finish = true;
      if (_state.game.score.player > _state.game.score.dealer) {
        _state.game.balance = _state.game.balance + _state.game.stake;
      } else if (_state.game.score.dealer > _state.game.score.player) {
        _state.game.balance = _state.game.balance - _state.game.stake;
      } else {
        /** @draw */
      }
    }

    return _state;
  })
);
