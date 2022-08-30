import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';

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

import { ANIMATION_SPEED } from '../app.component';
@Component({
  selector: 'app-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.scss'],
})
export class BetComponent {
  @ViewChild('input')
  public input!: ElementRef;

  @Output() public submitEvent = new EventEmitter<void>();

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

  public focus(): void {
    this.input.nativeElement.focus();
  }

  public submit($e: Event, form: FormGroup, value: number): void {
    $e.preventDefault();
    if (form.valid) {
      this.store.dispatch({ type: actions.RESET_GAME });
      this.store.dispatch({ type: actions.SET_BET, bet: value });
      setTimeout(() => {
        this.submitEvent.emit();
      }, ANIMATION_SPEED);
      this.close();
    }
  }
}
