import { Component, inject, OnInit, viewChild } from '@angular/core';
import { PlayersService } from '../players-service';
import { MatTable, MatTableModule } from '@angular/material/table';
import { SessionsService } from '../../sessions-service';

@Component({
  selector: 'app-rankings-component',
  imports: [MatTableModule],
  templateUrl: './rankings-component.html',
  styleUrl: './rankings-component.css',
})
export class RankingsComponent implements OnInit {
  playersService = inject(PlayersService);
  sessionsService = inject(SessionsService);

  rankingsTable = viewChild.required(MatTable);
  displayedColumns: string[] = ['name', 'score', 'place'];

  loadedPlayers = this.playersService.playersData;

  ngOnInit(): void {
    this.playersService.loadPlayers();
  }
}
