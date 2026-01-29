import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { SessionsService } from '../sessions-service';
import { NewSessionComponent } from './new-session-component/new-session-component';

@Component({
  selector: 'app-landing-component',
  imports: [RouterLink, MatButtonModule, MatCardModule, NewSessionComponent],
  templateUrl: './landing-component.html',
  styleUrl: './landing-component.css',
})
export class LandingComponent implements OnInit {
  private sessionsService = inject(SessionsService);
  rivalsSessions = this.sessionsService.rivalsSessions;
  versusSessions = this.sessionsService.versusSessions;

  ngOnInit(): void {
    this.sessionsService.loadSessions();
  }
}
