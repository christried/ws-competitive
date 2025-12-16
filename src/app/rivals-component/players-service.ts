import { Injectable, signal } from '@angular/core';
import { Player } from './players.model';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private players = signal<Player[]>([
    { name: 'Chris1', session: 'testsession1' },
    { name: 'Steffi1', session: 'testsession1' },
    { name: 'Kitty1', session: 'testsession1' },
  ]);
  playersData = this.players.asReadonly();

  currentSession = 'testsession1';

  addPlayer(name: string) {
    this.players.update((p) => [...p, { name: name, session: this.currentSession }]);
  }
}
