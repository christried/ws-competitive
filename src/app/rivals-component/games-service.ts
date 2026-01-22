import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Game } from './games.model';
import { HttpClient } from '@angular/common/http';
import { SessionsService } from '../sessions-service';
import { catchError, map, throwError } from 'rxjs';
import { PlayersService } from './players-service';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  private games = signal<Game[]>([]);
  gamesData = this.games.asReadonly();

  httpClient = inject(HttpClient);
  destroyRef = inject(DestroyRef);

  playersService = inject(PlayersService);
  sessionsService = inject(SessionsService);

  // Create and Subscribe to HTTP Fetch Method below and load games
  loadGames() {
    const GAMEGET = this.httpClient
      .get<{
        games: Game[];
      }>('http://localhost:3000/games/' + this.sessionsService.currentSession())
      .pipe(
        map((resData) => resData.games),
        catchError((err) => {
          console.log(err);
          return throwError(() => new Error('GamesData could not be loaded'));
        }),
      );

    console.log('loadGames() läuft mit session id: ' + this.sessionsService.currentSession());

    const subscription = GAMEGET.subscribe({
      next: (gamesData) => {
        this.games.set(gamesData);
        console.log(this.games());
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // Adding game HTTP Request AND Subscription

  addGame(title: string) {
    const GAMEPOST = this.httpClient
      .post<{ games: Game[] }>('http://localhost:3000/game', {
        game: title,
        sessionId: this.sessionsService.currentSession(),
      })
      .pipe(
        map((resData) => resData.games),
        catchError((err) => {
          console.log(err);
          return throwError(() => new Error('Game could not be added'));
        }),
      );

    const subscription = GAMEPOST.subscribe({
      next: (gamesData) => {
        this.games.set(gamesData);
      },
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // Removing a game HTTP Request AND Subscription

  removeGame(title: string) {
    console.log('removeGame called for ' + title);

    const GAMEDELETE = this.httpClient
      .delete<{ games: Game[] }>('http://localhost:3000/delete-game', {
        body: { game: title, sessionId: this.sessionsService.currentSession() },
      })
      .pipe(
        map((resData) => resData.games),
        catchError((err) => {
          console.log(err);
          return throwError(() => new Error('Game could not be added'));
        }),
      );

    const subscription = GAMEDELETE.subscribe({
      next: (gamesData) => {
        this.games.set(gamesData);
      },
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // Updating Game Results HTTP Request AND Subscription

  updateGameResults(title: string, results: {}) {
    const RESULTSPOST = this.httpClient
      .post<{ games: Game[] }>('http://localhost:3000/results', {
        title: title,
        sessionId: this.sessionsService.currentSession(),
        results: results,
      })
      .pipe(
        map((resData) => resData.games),
        catchError((err) => {
          console.log(err);
          return throwError(() => new Error('Failed to POST RESULTS'));
        }),
      );

    const subscription = RESULTSPOST.subscribe({
      next: (gamesData) => {
        this.games.set(gamesData);
        this.playersService.updateScores();
      },
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
