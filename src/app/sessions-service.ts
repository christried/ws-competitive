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

  initializeFromRoute(route: ActivatedRoute) {
    route.paramMap
      .pipe(
        map((params) => params.get('sessionId')),
        filter((sessionId): sessionId is string => !!sessionId),
        takeUntilDestroyed(this.destroyRef)
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
        catchError(() => of(false))
      );
  }
}
