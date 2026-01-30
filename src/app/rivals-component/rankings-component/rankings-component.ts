import { Component, inject, OnInit, viewChild } from '@angular/core';
import { PlayersService } from '../players-service';
import { MatTable, MatTableModule } from '@angular/material/table';
import { SessionsService } from '../../sessions-service';
import { Player } from '../players.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-rankings-component',
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './rankings-component.html',
  styleUrl: './rankings-component.css',
})
export class RankingsComponent implements OnInit {
  playersService = inject(PlayersService);
  sessionsService = inject(SessionsService);

  rankingsTable = viewChild.required(MatTable);
  displayedColumns: string[] = ['actions', 'name', 'score', 'place'];

  loadedPlayers = this.playersService.playersData;

  ngOnInit(): void {
    // Initial load - polling handles subsequent updates from parent component
    this.playersService.loadPlayers();
    this.playersService.updateScores();
  }

  onClickDelete(player: Player) {
    this.playersService.removePlayer(player.name);
  }
}
