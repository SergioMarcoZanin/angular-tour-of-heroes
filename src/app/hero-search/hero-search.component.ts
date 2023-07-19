import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: [ './hero-search.component.css' ]
})
export class HeroSearchComponent implements OnInit {
  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  // Inserisce un termine di ricerca nel flusso osservabile.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // attendi 300 ms dopo ogni battitura prima di considerare il termine
      debounceTime(300),

      // ignora il nuovo termine se uguale al termine precedente
      distinctUntilChanged(),

      // passa a una nuova ricerca osservabile ogni volta che il termine cambia
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }
}
