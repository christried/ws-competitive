import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Game } from './games.model';
import { HttpClient } from '@angular/common/http';
import { SessionsService } from '../sessions-service';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  private games = signal<Game[]>([]);
  gamesData = this.games.asReadonly();

  httpClient = inject(HttpClient);
  destroyRef = inject(DestroyRef);

  sessionsService = inject(SessionsService);

  // Subscribe to HTTP Fetch Method below and load games
  loadGames() {
    console.log('loadPlayers() läuft mit session id: ' + this.sessionsService.currentSession());
    const subscription = this.fetchGames(this.sessionsService.currentSession()).subscribe({
      next: (gamesData) => {
        this.games.set(gamesData);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // HTTP Method to Fetch all GamesData from the backend
  fetchGames(sessionId: string) {
    return this.httpClient.get<{ games: Game[] }>('http://localhost:3000/games/' + sessionId).pipe(
      map((resData) => resData.games),
      catchError((err) => {
        console.log(err);
        return throwError(() => new Error('GamesData could not be loaded'));
      })
    );
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
        })
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
        })
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
}
