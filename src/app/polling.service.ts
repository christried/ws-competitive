import { DestroyRef, inject, Injectable } from '@angular/core';
import { interval, Subscription, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SessionsService } from './sessions-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PollingService {
  private readonly POLL_INTERVAL = 2000;

  private pollingSubscription: Subscription | null = null;
  private destroyRef = inject(DestroyRef);
  private sessionsService = inject(SessionsService);
  private router = inject(Router);

  // Subjects that components/services can subscribe to
  pollTick$ = new Subject<void>();

  /**
   * Start polling - call this when entering a session view
   */
  startPolling() {
    // Don't start if already polling
    if (this.pollingSubscription) {
      return;
    }

    console.log('Polling started');

    this.pollingSubscription = interval(this.POLL_INTERVAL)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        // Check if current session still exists
        this.checkSessionExists();

        // Emit tick for other services to react
        this.pollTick$.next();
      });
  }

  /**
   * Stop polling - call this when leaving a session view
   */
  stopPolling() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
      console.log('Polling stopped');
    }
  }

  /**
   * Check if the current session still exists, redirect if not
   */
  private checkSessionExists() {
    const currentSession = this.sessionsService.currentSession();
    const currentApp = this.sessionsService.currentApp();

    if (currentSession && currentApp) {
      this.sessionsService.checkSessionExists(currentSession, currentApp).subscribe({
        next: (exists) => {
          if (!exists) {
            console.log('Session no longer exists, redirecting to landing page');
            this.stopPolling();
            this.router.navigate(['/']);
          }
        },
        error: () => {
          // Network error - don't redirect, just log
          console.log('Could not check session existence (network error)');
        },
      });
    }
  }
}
