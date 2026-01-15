export interface Game {
  title: string;
  results?: { [playerName: string]: number };
}
