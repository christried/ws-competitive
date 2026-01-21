import { Routes } from '@angular/router';
import { RivalsComponent } from './rivals-component/rivals-component';
import { VersusComponent } from './versus-component/versus-component';
import { LandingComponent } from './landing-component/landing-component';
import { sessionGuard } from './session.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'rivals/:sessionId',
    component: RivalsComponent,
    canActivate: [sessionGuard],
  },
  {
    path: 'versus/:sessionId',
    component: VersusComponent,
    canActivate: [sessionGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
