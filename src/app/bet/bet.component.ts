import { Component } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { Store } from '@ngrx/store';

import { map, Observable } from 'rxjs';

import { State } from '../@ngrx/state';

import * as actions from '../@ngrx/actions';

@Component({
  selector: 'app-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.scss'],
})
export class BetComponent {
  public state$: Observable<State['_']> = this.store.pipe(
    map((state: State) => state._)
  );

  constructor(private store: Store<State>, private fb: FormBuilder) {}

  public form: FormGroup = this.fb.group({
    value: new FormControl(10, Validators.required),
  });

  public close(): void {
    this.store.dispatch({
      type: actions.SET_MODAL_PROPS,
      props: { show: false },
    });
  }

  public submit($e: Event, form: FormGroup, value: number): void {
    $e.preventDefault();
    this.close();
  }
}
