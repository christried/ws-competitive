import { computed, DestroyRef, inject, Injectable, OnInit, signal } from '@angular/core';
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
  private lockStatus = signal<Boolean>(false);
  isLocked = this.lockStatus.asReadonly();

  httpClient = inject(HttpClient);
  destroyRef = inject(DestroyRef);

  sessionsService = inject(SessionsService);

  // generate placement options dynamically to show in results in Component (depending on how many players there are)

  playerOptions = computed(() => {
    const count = this.players().length;
    return Array.from({ length: count }, (_, i) => {
      return i + 1;
    });
  });

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

  // Updating Player Scores HTTP & Sub
  updateScores() {
    console.log('updateScores() läuft mit session id: ' + this.sessionsService.currentSession());
    const SCORESGET = this.httpClient
      .get<{ players: Player[] }>(
        'http://localhost:3000/scores/' + this.sessionsService.currentSession()
      )
      .pipe(
        map((resData) => resData.players),
        catchError((err) => {
          console.log(err);
          return throwError(() => new Error('Scores data could not be loaded'));
        })
      );

    const subscription = SCORESGET.subscribe({
      next: (playersData) => {
        this.players.set(playersData);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // Create and Subscribe to HTTP Fetch Method below and load lock status
  loadLockStatus() {
    const LOCKGET = this.httpClient
      .get<{ isLocked: Boolean }>(
        'http://localhost:3000/lock-status/' + this.sessionsService.currentSession()
      )
      .pipe(
        map((resData) => resData.isLocked),
        catchError((err) => {
          console.log(err);
          return throwError(() => new Error('Lock Status could not be loaded'));
        })
      );

    console.log('loadLockStatus() läuft mit session id: ' + this.sessionsService.currentSession());

    const subscription = LOCKGET.subscribe({
      next: (isLocked) => {
        this.lockStatus.set(isLocked);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  toggleLock() {
    console.log('toggleLock() läuft mit session id: ' + this.sessionsService.currentSession());
    const LOCKPUT = this.httpClient
      .put<{ isLocked: Boolean }>('http://localhost:3000/lock', {
        sessionId: this.sessionsService.currentSession(),
      })
      .pipe(
        map((resData) => resData.isLocked),
        catchError((err) => {
          console.log(err);
          return throwError(() => new Error('isLocked Data could not be loaded'));
        })
      );

    const subscription = LOCKPUT.subscribe({
      next: (isLocked) => {
        this.lockStatus.set(isLocked);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
    this.lockStatus.set(!this.lockStatus());
  }
}
