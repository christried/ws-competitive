import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from './header-component/header-component';
import { RankingsComponent } from './rankings-component/rankings-component';

import { MatCardModule } from '@angular/material/card';
import { NewGameComponent } from './new-game-component/new-game-component';
import { ResultsComponent } from './results-component/results-component';
import { PlayersService } from './players-service';
import { ActivatedRoute } from '@angular/router';
import { SessionsService } from '../sessions-service';

@Component({
  selector: 'app-versus-component',
  imports: [HeaderComponent, RankingsComponent, MatCardModule, NewGameComponent, ResultsComponent],
  templateUrl: './versus-component.html',
  styleUrl: './versus-component.css',
})
export class VersusComponent implements OnInit {
  private route = inject(ActivatedRoute);
  sessionsService = inject(SessionsService);
  playersService = inject(PlayersService);

  ngOnInit(): void {
    this.sessionsService.initializeFromRoute(this.route, 'versus');
  }
}
