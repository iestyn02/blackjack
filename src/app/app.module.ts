import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';

import { reducer } from './@ngrx/reducer';

/** @components */
import { AppComponent } from './app.component';

import { CardComponent, SafePipe } from './card/card.component';

import { BetComponent } from './bet/bet.component';

@NgModule({
  declarations: [AppComponent, CardComponent, SafePipe, BetComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ _: reducer }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
