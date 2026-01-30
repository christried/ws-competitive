import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { SessionsService } from '../sessions-service';
import { NewSessionComponent } from './new-session-component/new-session-component';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-landing-component',
  imports: [RouterLink, MatButtonModule, MatCardModule, NewSessionComponent],
  templateUrl: './landing-component.html',
  styleUrl: './landing-component.css',
})
export class LandingComponent implements OnInit, OnDestroy {
  private sessionsService = inject(SessionsService);
  private pollingSubscription?: Subscription;

  rivalsSessions = this.sessionsService.rivalsSessions;
  versusSessions = this.sessionsService.versusSessions;

  ngOnInit(): void {
    this.sessionsService.loadSessions();

    // Poll for session list updates every 5 seconds
    this.pollingSubscription = interval(5000).subscribe(() => {
      this.sessionsService.loadSessions();
    });
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }
}
