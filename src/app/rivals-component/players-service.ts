import { DestroyRef, inject, Injectable, OnInit, signal } from '@angular/core';
import { Player } from './players.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { SessionsService } from '../sessions-service';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private players = signal<Player[]>([]);
  playersData = this.players.asReadonly();

  httpClient = inject(HttpClient);
  destroyRef = inject(DestroyRef);

  sessionsService = inject(SessionsService);

  // Subscribe to HTTP Fetch Method below and load players
  loadPlayers() {
    console.log('fetching läuft mit session id: ' + this.sessionsService.currentSession());
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
    return this.httpClient
      .get<{ players: string[] }>('http://localhost:3000/players/' + sessionId)
      .pipe(
        map((resData) => resData.players.map((name) => ({ name }))),
        catchError((err) => {
          console.log(err);
          return throwError(() => new Error('Playerdata could not be loaded'));
        })
      );
  }

  // Adding players HTTP Request AND Subscription

  addPlayer(name: string) {
    const PLAYERPOST = this.httpClient
      .post<{ players: string[] }>('http://localhost:3000/player', {
        player: name,
        sessionId: this.sessionsService.currentSession(),
      })
      .pipe(
        map((resData) => resData.players.map((name) => ({ name }))),
        catchError((err) => {
          console.log(err);
          return throwError(() => new Error('Player could not be added'));
        })
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
      .delete<{ players: string[] }>('http://localhost:3000/delete-player', {
        body: { player: name, sessionId: this.sessionsService.currentSession() },
      })
      .pipe(
        map((resData) => resData.players.map((name) => ({ name }))),
        catchError((err) => {
          console.log(err);
          return throwError(() => new Error('Player could not be added'));
        })
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
