import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Game } from './games.model';
import { HttpClient } from '@angular/common/http';
import { SessionsService } from '../sessions-service';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  private readonly API_URL = 'http://localhost:3001'; // 3001 is versus, 3000 is rivals

  private games = signal<Game[]>([]);
  gamesData = this.games.asReadonly();

  // count wins for each team
  teamOneWins = computed(() => this.games().filter((g) => g.winner === 1).length);
  teamTwoWins = computed(() => this.games().filter((g) => g.winner === 2).length);

  httpClient = inject(HttpClient);
  destroyRef = inject(DestroyRef);
  sessionsService = inject(SessionsService);

  // Load games from backend
  loadGames() {
    const subscription = this.httpClient
      .get<{ games: Game[] }>(`${this.API_URL}/games/${this.sessionsService.currentSession()}`)
      .pipe(
        map((resData) => resData.games),
        catchError((err) => {
          console.log(err);
          return throwError(() => new Error('GamesData could not be loaded'));
        }),
      )
      .subscribe({
        next: (gamesData) => {
          this.games.set(gamesData);
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  // Add a new game
  addGame(title: string) {
    const subscription = this.httpClient
      .post<{ games: Game[] }>(`${this.API_URL}/game`, {
        game: title,
        sessionId: this.sessionsService.currentSession(),
      })
      .pipe(
        map((resData) => resData.games),
        catchError((err) => {
          console.log(err);
          return throwError(() => new Error('Game could not be added'));
        }),
      )
      .subscribe({
        next: (gamesData) => {
          this.games.set(gamesData);
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  // Remove a game
  removeGame(title: string) {
    const subscription = this.httpClient
      .delete<{ games: Game[] }>(`${this.API_URL}/delete-game`, {
        body: { game: title, sessionId: this.sessionsService.currentSession() },
      })
      .pipe(
        map((resData) => resData.games),
        catchError((err) => {
          console.log(err);
          return throwError(() => new Error('Game could not be removed'));
        }),
      )
      .subscribe({
        next: (gamesData) => {
          this.games.set(gamesData);
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  // Set the winner of a game
  setGameWinner(title: string, winner: 1 | 2) {
    const subscription = this.httpClient
      .post<{ games: Game[] }>(`${this.API_URL}/results`, {
        title: title,
        sessionId: this.sessionsService.currentSession(),
        winner: winner,
      })
      .pipe(
        map((resData) => resData.games),
        catchError((err) => {
          console.log(err);
          return throwError(() => new Error('Failed to set game winner'));
        }),
      )
      .subscribe({
        next: (gamesData) => {
          this.games.set(gamesData);
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
