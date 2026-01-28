import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionsService } from './sessions-service';
import { map } from 'rxjs';

export const sessionGuard: CanActivateFn = (route, state) => {
  const sessionsService = inject(SessionsService);
  const router = inject(Router);

  const sessionId = route.paramMap.get('sessionId');
  // Detect app from the URL path
  const appName = state.url.includes('/versus/') ? 'versus' : 'rivals';

  if (!sessionId) {
    return router.createUrlTree(['/']);
  }

  return sessionsService.checkSessionExists(sessionId, appName).pipe(
    map((exists) => {
      if (exists) {
        return true; // Allow navigation
      } else {
        return router.createUrlTree(['/']); // Redirect to landing
      }
    }),
  );
};
