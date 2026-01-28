import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Player } from './players.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { SessionsService } from '../sessions-service';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private readonly API_URL = 'http://localhost:3001';

  private players = signal<Player[]>([]);
  playersData = this.players.asReadonly();

  // Filter players by team
  teamOne = computed(() => this.players().filter((p) => p.team === 1));
  teamTwo = computed(() => this.players().filter((p) => p.team === 2));

  httpClient = inject(HttpClient);
  destroyRef = inject(DestroyRef);
  sessionsService = inject(SessionsService);

  // Subscribe to HTTP Fetch Method below and load players
  loadPlayers() {
    console.log('loadPlayers() läuft mit session id: ' + this.sessionsService.currentSession());
    const subscription = this.fetchPlayers(this.sessionsService.currentSession()).subscribe({
      next: (playersData) => {
        this.players.set(playersData);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // HTTP Method to Fetch all Playerdata from the backend
  fetchPlayers(sessionId: string) {
    return this.httpClient.get<{ players: Player[] }>(`${this.API_URL}/players/${sessionId}`).pipe(
      map((resData) => resData.players),
      catchError((err) => {
        console.log(err);
        return throwError(() => new Error('Playerdata could not be loaded'));
      }),
    );
  }

  // Adding players HTTP Request AND Subscription
  addPlayer(name: string, team: 1 | 2) {
    const PLAYERPOST = this.httpClient
      .post<{ players: Player[] }>(`${this.API_URL}/player`, {
        player: name,
        team: team,
        sessionId: this.sessionsService.currentSession(),
      })
      .pipe(
        map((resData) => resData.players),
        catchError((err) => {
          console.log(err);
          return throwError(() => new Error('Player could not be added'));
        }),
      );

    const subscription = PLAYERPOST.subscribe({
      next: (playersData) => {
        this.players.set(playersData);
      },
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // Removing players HTTP Request AND Subscription
  removePlayer(name: string) {
    console.log('removePlayer called');

    const PLAYERDELETE = this.httpClient
      .delete<{ players: Player[] }>(`${this.API_URL}/delete-player`, {
        body: { player: name, sessionId: this.sessionsService.currentSession() },
      })
      .pipe(
        map((resData) => resData.players),
        catchError((err) => {
          console.log(err);
          return throwError(() => new Error('Player could not be removed'));
        }),
      );

    const subscription = PLAYERDELETE.subscribe({
      next: (playersData) => {
        this.players.set(playersData);
      },
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
