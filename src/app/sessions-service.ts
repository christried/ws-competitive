import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter, map, Observable, of } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  private readonly RIVALS_API_URL = environment.rivalsApiUrl;
  private readonly VERSUS_API_URL = environment.versusApiUrl;

  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private httpClient = inject(HttpClient);

  private session = signal<string>('testsession1');
  public currentSession = this.session.asReadonly();
  private appName = signal<'rivals' | 'versus'>('rivals');
  public currentApp = this.appName.asReadonly();

  rivalsSessions = signal<string[]>([]);
  versusSessions = signal<string[]>([]);

  initializeFromRoute(route: ActivatedRoute, appName: 'rivals' | 'versus') {
    this.appName.set(appName);

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

  checkSessionExists(sessionId: string, appName?: 'rivals' | 'versus'): Observable<boolean> {
    const apiUrl = appName === 'rivals' ? this.RIVALS_API_URL : this.VERSUS_API_URL;
    return this.httpClient.get<{ exists: boolean }>(`${apiUrl}/session-exists/${sessionId}`).pipe(
      map((resData) => resData.exists),
      catchError(() => of(false)),
    );
  }

  getSessionList(selectedApp: 'rivals' | 'versus') {
    const apiUrl = selectedApp === 'rivals' ? this.RIVALS_API_URL : this.VERSUS_API_URL;

    return this.httpClient.get<{ sessions: string[] }>(`${apiUrl}/sessions`).pipe(
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

    const apiUrl = selectedApp === 'rivals' ? this.RIVALS_API_URL : this.VERSUS_API_URL;

    this.httpClient
      .post<{ sessions: string[] }>(`${apiUrl}/new-session`, { selectedApp, sessionId })
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

  deleteSession() {
    const selectedApp = this.appName();
    const sessionId = this.session();

    console.log('deleting session with name ' + sessionId + ' for selected app: ' + selectedApp);

    const apiUrl = selectedApp === 'rivals' ? this.RIVALS_API_URL : this.VERSUS_API_URL;

    this.httpClient
      .delete<{ sessions: string[] }>(`${apiUrl}/delete-session`, {
        body: { selectedApp, sessionId },
      })
      .pipe(
        map((resData) => resData.sessions),
        catchError(() => of([])),
      )
      .subscribe({
        next: (sessions) => {
          if (selectedApp === 'rivals') {
            this.rivalsSessions.set(sessions);
          } else {
            this.versusSessions.set(sessions);
          }

          this.router.navigate(['/']);
        },
      });
  }
}
