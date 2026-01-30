import { Component, computed, inject, OnInit } from '@angular/core';
import { PlayersService } from '../players-service';
import { GamesService } from '../games-service';
import { Player } from '../players.model';
import { Team } from '../team.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { NewPlayerComponent } from '../new-player-component/new-player-component';

@Component({
  selector: 'app-versus-rankings-component',
  imports: [MatIconModule, MatButtonModule, MatCardModule, MatListModule, NewPlayerComponent],
  templateUrl: './rankings-component.html',
  styleUrl: './rankings-component.css',
})
export class RankingsComponent implements OnInit {
  playersService = inject(PlayersService);
  gamesService = inject(GamesService);

  teams = computed<Team[]>(() => {
    const team1: Team = {
      id: 1,
      name: 'Team 1',
      players: this.playersService.teamOne(),
      wins: this.gamesService.teamOneWins(),
      rank: 1,
    };

    const team2: Team = {
      id: 2,
      name: 'Team 2',
      players: this.playersService.teamTwo(),
      wins: this.gamesService.teamTwoWins(),
      rank: 1,
    };

    const sorted = [team1, team2].sort((a, b) => b.wins - a.wins);
    sorted[0].rank = 1;
    sorted[1].rank = sorted[1].wins === sorted[0].wins ? 1 : 2;

    return sorted;
  });

  ngOnInit(): void {
    // Initial load - polling handles subsequent updates from parent component
    this.playersService.loadPlayers();
    this.gamesService.loadGames();
  }

  onRemovePlayer(player: Player) {
    this.playersService.removePlayer(player.name);
  }
}
