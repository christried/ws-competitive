export interface Player {
  name: string;
  team: 1 | 2;
}

export interface TeamScores {
  teamOneWins: number;
  teamTwoWins: number;
}
