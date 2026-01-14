import { Component, inject, OnInit } from '@angular/core';
import { GamesService } from '../games-service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-results-component',
  imports: [MatExpansionModule, MatButtonModule],
  templateUrl: './results-component.html',
  styleUrl: './results-component.css',
})
export class ResultsComponent implements OnInit {
  gamesService = inject(GamesService);

  games = this.gamesService.gamesData;

  ngOnInit(): void {
    this.gamesService.loadGames();
  }

  onRemoveGame(title: string) {
    this.gamesService.removeGame(title);
  }
}
