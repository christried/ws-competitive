import { Component, inject, OnInit } from '@angular/core';
import { GamesService } from '../games-service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Game } from '../games.model';

@Component({
  selector: 'app-versus-results-component',
  imports: [MatExpansionModule, MatButtonModule, MatRadioModule, ReactiveFormsModule],
  templateUrl: './results-component.html',
  styleUrl: './results-component.css',
})
export class ResultsComponent implements OnInit {
  gamesService = inject(GamesService);

  games = this.gamesService.gamesData;

  winnerControls = new Map<string, FormControl<1 | 2 | null>>();

  ngOnInit(): void {
    this.gamesService.loadGames();
  }

  // Get or create a FormControl for a specific game
  getWinnerControl(gameTitle: string): FormControl<1 | 2 | null> {
    if (!this.winnerControls.has(gameTitle)) {
      // Get the current winner from the game data (if any)
      const game = this.games().find((g) => g.title === gameTitle);
      const initialValue = game?.winner ?? null;

      this.winnerControls.set(gameTitle, new FormControl<1 | 2 | null>(initialValue));
    }
    return this.winnerControls.get(gameTitle)!;
  }

  // Get display text for winner in panel description
  getWinnerText(game: Game): string {
    if (!game.winner) return 'No result yet';
    return `Winner: Team ${game.winner}`;
  }

  // Save the winner for a game
  onSaveWinner(gameTitle: string) {
    const control = this.getWinnerControl(gameTitle);
    const winner = control.value;

    if (winner) {
      this.gamesService.setGameWinner(gameTitle, winner);
    }
  }

  // Remove a game
  onRemoveGame(title: string) {
    this.gamesService.removeGame(title);
    this.winnerControls.delete(title); // Clean up the control
  }
}
