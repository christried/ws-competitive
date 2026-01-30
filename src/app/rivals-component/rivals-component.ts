import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { HeaderComponent } from './header-component/header-component';
import { RankingsComponent } from './rankings-component/rankings-component';
import { NewPlayerComponent } from './new-player-component/new-player-component';
import { MatCardModule } from '@angular/material/card';
import { NewGameComponent } from './new-game-component/new-game-component';
import { ResultsComponent } from './results-component/results-component';
import { PlayersService } from './players-service';
import { ActivatedRoute } from '@angular/router';
import { SessionsService } from '../sessions-service';
import { GamesService } from './games-service';
import { PollingService } from '../polling.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rivals-component',
  imports: [
    HeaderComponent,
    RankingsComponent,
    NewPlayerComponent,
    MatCardModule,
    NewGameComponent,
    ResultsComponent,
  ],
  templateUrl: './rivals-component.html',
  styleUrl: './rivals-component.css',
})
export class RivalsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private pollingService = inject(PollingService);
  private gamesService = inject(GamesService);

  sessionsService = inject(SessionsService);
  playersService = inject(PlayersService);

  private pollSubscription?: Subscription;

  ngOnInit(): void {
    this.sessionsService.initializeFromRoute(this.route, 'rivals');
    this.playersService.loadLockStatus();

    // Start polling and subscribe to poll ticks
    this.pollingService.startPolling();
    this.pollSubscription = this.pollingService.pollTick$.subscribe(() => {
      this.refreshData();
    });
  }

  ngOnDestroy(): void {
    this.pollingService.stopPolling();
    this.pollSubscription?.unsubscribe();
    console.log('Rivals component destroyed, polling stopped');
  }

  private refreshData(): void {
    // Refresh all rivals data
    this.playersService.updateScores();
    this.gamesService.loadGames();
    this.playersService.loadLockStatus();
  }
}
