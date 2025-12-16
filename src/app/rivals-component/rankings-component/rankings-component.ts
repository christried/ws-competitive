import { Component, inject, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import { PlayersService } from '../players-service';
import { MatTable, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-rankings-component',
  imports: [MatTableModule],
  templateUrl: './rankings-component.html',
  styleUrl: './rankings-component.css',
})
export class RankingsComponent {
  playersService = inject(PlayersService);
  rankingsTable = viewChild.required(MatTable);
  displayedColumns: string[] = ['name', 'score', 'place'];
}
