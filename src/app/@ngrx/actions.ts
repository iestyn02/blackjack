import { createAction, props } from '@ngrx/store';

import { State } from './state';

export const SET_MODAL_PROPS = '[Modal] Set Modal Properties';
export const PATCH_KEYS_PROPS = '[Keys] Patch Keys Properties';
export const ADD_CARD = '[Game] Add Card';
export const SET_BET = '[Game] Set Bet';
export const RESET_GAME = '[Game] Reset Game';

export const setModalProps = createAction(
  SET_MODAL_PROPS,
  props<{ props: State['_']['modal'] }>()
);

export const patchKeyProps = createAction(
  PATCH_KEYS_PROPS,
  props<{ props: State['_']['keys'] }>()
);

export const addCard = createAction(
  ADD_CARD,
  props<{ identity: 'dealer' | 'player'; end?: boolean }>()
);

export const setBet = createAction(SET_BET, props<{ bet: number }>());

export const resetGame = createAction(RESET_GAME);
