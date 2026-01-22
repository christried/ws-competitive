import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private httpClient = inject(HttpClient);

  private session = signal<string>('testsession1');
  public currentSession = this.session.asReadonly();

  rivalsSessions = signal<string[]>([]);
  versusSessions = signal<string[]>([]);

  initializeFromRoute(route: ActivatedRoute) {
    route.paramMap
      .pipe(
        map((params) => params.get('sessionId')),
        filter((sessionId): sessionId is string => !!sessionId),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((sessionId) => {
        this.session.set(sessionId);
      });
  }

  setSession(selectedApp: 'rivals' | 'versus', sessionId: string) {
    this.router.navigate(['/', selectedApp, sessionId]);
  }

  checkSessionExists(sessionId: string): Observable<boolean> {
    return this.httpClient
      .get<{ exists: boolean }>('http://localhost:3000/session-exists/' + sessionId)
      .pipe(
        map((resData) => resData.exists),
        catchError(() => of(false)),
      );
  }

  getSessionList(selectedApp: 'rivals' | 'versus') {
    const appUrl = selectedApp === 'rivals' ? 'http://localhost:3000/' : 'http://localhost:3001/';

    return this.httpClient.get<{ sessions: string[] }>(appUrl + 'sessions').pipe(
      map((resData) => resData.sessions),
      catchError(() => of([])),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  loadSessions() {
    this.getSessionList('rivals').subscribe({
      next: (sessions) => {
        this.rivalsSessions.set(sessions);
      },
    });
    this.getSessionList('versus').subscribe({
      next: (sessions) => {
        this.versusSessions.set(sessions);
      },
    });
  }

  addSession(selectedApp: 'rivals' | 'versus', sessionId: string) {
    console.log('adding session with name ' + sessionId + 'for selected app: ' + selectedApp);

    const appUrl =
      selectedApp === 'rivals'
        ? 'http://localhost:3000/new-session'
        : 'http://localhost:3001/new-session';

    this.httpClient
      .post<{ sessions: string[] }>(appUrl, { selectedApp, sessionId })
      .pipe(
        map((resData) => resData.sessions),
        catchError(() => of([])),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (sessions) => {
          if (selectedApp === 'rivals') {
            this.rivalsSessions.set(sessions);
          } else {
            this.versusSessions.set(sessions);
          }
        },
      });
  }
}
