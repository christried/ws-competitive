import { Component, inject, OnInit } from '@angular/core';
import { PlayersService } from '../players-service';
import { Player } from '../players.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-versus-rankings-component',
  imports: [MatIconModule, MatButtonModule, MatCardModule, MatListModule],
  templateUrl: './rankings-component.html',
  styleUrl: './rankings-component.css',
})
export class RankingsComponent implements OnInit {
  playersService = inject(PlayersService);

  teamOne = this.playersService.teamOne;
  teamTwo = this.playersService.teamTwo;
  teamOneWins = this.playersService.teamOneWins;
  teamTwoWins = this.playersService.teamTwoWins;

  ngOnInit(): void {
    this.playersService.loadPlayers();
  }

  onRemovePlayer(player: Player) {
    this.playersService.removePlayer(player.name);
  }
}
