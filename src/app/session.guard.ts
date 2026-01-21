import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionsService } from './sessions-service';
import { map } from 'rxjs';

export const sessionGuard: CanActivateFn = (route, state) => {
  const sessionsService = inject(SessionsService);
  const router = inject(Router);

  const sessionId = route.paramMap.get('sessionId');

  if (!sessionId) {
    return router.createUrlTree(['/']);
  }

  return sessionsService.checkSessionExists(sessionId).pipe(
    map((exists) => {
      if (exists) {
        return true; // Allow navigation
      } else {
        return router.createUrlTree(['/']); // Redirect to landing
      }
    })
  );
};
