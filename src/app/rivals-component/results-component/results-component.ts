import { Component, inject } from '@angular/core';
import { GamesService } from '../games-service';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-results-component',
  imports: [MatExpansionModule],
  templateUrl: './results-component.html',
  styleUrl: './results-component.css',
})
export class ResultsComponent {
  gamesService = inject(GamesService);

  games = this.gamesService.gamesData;
}
