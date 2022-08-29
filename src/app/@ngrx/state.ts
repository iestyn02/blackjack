import { Rank, Symbol } from '../app.models';

/** @format */
export type Keys = 'A' | 'S' | 'Escape' | null;

export interface State {
  readonly _: {
    readonly modal: {
      show: boolean;
    };
    readonly keys: {
      lastPressed: Keys;
      currentPressed: Keys;
    };
    game: {
      finish: boolean;
      score: {
        dealer: number;
        player: number;
      };
      hand: {
        dealer: { rank: Rank; symbol: Symbol }[];
        player: { rank: Rank; symbol: Symbol }[];
      };
    };
  };
}
