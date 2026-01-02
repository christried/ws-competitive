import { Injectable, signal } from '@angular/core';
import { Game } from './games.model';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  private games = signal<Game[]>([
    { name: 'League of Legends' },
    { name: 'Overwatch 2' },
    { name: 'StarCraft 2' },
  ]);
  gamesData = this.games.asReadonly();

  loadGames() {}

  fetchGames() {}

  addGame() {}
  removeGame() {}
}
