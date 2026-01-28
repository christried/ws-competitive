import { Player } from './players.model';

export interface Team {
  id: 1 | 2;
  name: string;
  players: Player[];
  wins: number;
  rank: number;
}
