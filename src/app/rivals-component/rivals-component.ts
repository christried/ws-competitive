import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from './header-component/header-component';
import { RankingsComponent } from './rankings-component/rankings-component';
import { NewPlayerComponent } from './new-player-component/new-player-component';
import { MatCardModule } from '@angular/material/card';
import { NewGameComponent } from './new-game-component/new-game-component';
import { ResultsComponent } from './results-component/results-component';
import { PlayersService } from './players-service';
import { ActivatedRoute } from '@angular/router';
import { SessionsService } from '../sessions-service';

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
export class RivalsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  sessionsService = inject(SessionsService);
  playersService = inject(PlayersService);

  ngOnInit(): void {
    this.sessionsService.initializeFromRoute(this.route);
    this.playersService.loadLockStatus();
  }
}
