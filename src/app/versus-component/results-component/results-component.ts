import { Component, effect, inject, OnInit } from '@angular/core';
import { GamesService } from '../games-service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { PlayersService } from '../players-service';
import { ErrorStateMatcher } from '@angular/material/core';

/** VALIDATOR: Checks if any two players have the same rank */
const uniqueRankingsValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const group = control as FormGroup;
  const values = Object.values(group.getRawValue());
  const filledValues = values.filter((v) => v !== '' && v !== null && v !== undefined);
  const uniqueValues = new Set(filledValues);

  return filledValues.length > uniqueValues.size ? { duplicateRankings: true } : null;
};

/** MATCHER: Shows error if group is invalid (duplicates) and user has interacted */
export class ResultsErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    if (!control || !control.parent) return false;
    const group = control.parent as FormGroup;
    const allDirtyOrTouched = Object.values(group.controls).every((c) => c.dirty || c.touched);
    return allDirtyOrTouched && group.invalid;
  }
}

@Component({
  selector: 'app-versus-results-component',
  imports: [
    MatExpansionModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './results-component.html',
  styleUrl: './results-component.css',
})
export class ResultsComponent implements OnInit {
  gamesService = inject(GamesService);
  playersService = inject(PlayersService);

  games = this.gamesService.gamesData;
  players = this.playersService.playersData;
  selectOptions = this.playersService.playerOptions;

  rankingsForm = new FormGroup({});
  matcher = new ResultsErrorStateMatcher();

  constructor() {
    // Rebuilds form structure immediately when data signals change : ran into a problem when reading [disabled] for the Update Rankings button,
    // because getControl was manipulating the form mid-rendering
    effect(() => {
      const games = this.games();
      const players = this.players();

      games.forEach((game) => {
        let gameGroup = this.rankingsForm.get(game.title) as FormGroup;

        if (!gameGroup) {
          gameGroup = new FormGroup({}, { validators: uniqueRankingsValidator });
          this.rankingsForm.addControl(game.title, gameGroup);
        }

        players.forEach((player) => {
          if (!gameGroup.get(player.name)) {
            const initialValue = this.getInitialValue(game.title, player.name);
            const control = new FormControl(initialValue, Validators.required);
            gameGroup.addControl(player.name, control);
          }
        });
      });
    });
  }

  ngOnInit(): void {
    this.gamesService.loadGames();
  }

  getControl(gameTitle: string, playerName: string): FormControl {
    return this.rankingsForm.get(gameTitle)?.get(playerName) as FormControl;
  }

  getInitialValue(gameTitle: string, playerName: string): number | any {
    const game = this.games().find((g) => g.title === gameTitle);
    const val = game?.results?.[playerName];
    return val !== undefined ? val : '';
  }

  getWinnerName(gameTitle: string) {
    const results = this.games().find((g) => g.title === gameTitle)?.results;

    if (!results) {
      return '';
    }
    // Native way: Look for the key where the value is 1
    const winnerName = Object.keys(results).find((player) => results[player] === 1);

    return winnerName ? 'W: ' + winnerName : '';
  }

  onClickUpdateResults(gameTitle: string) {
    const gameGroup = this.rankingsForm.get(gameTitle);
    if (gameGroup && gameGroup.valid) {
      console.log(`Rankings for ${gameTitle}: `, gameGroup.value);
      this.gamesService.updateGameResults(gameTitle, gameGroup.value);
    }
  }

  onClosePanel(gameTitle: string) {
    const group = this.rankingsForm.get(gameTitle);
    if (group) {
      group.markAsPristine();
      group.markAsUntouched();
      Object.values((group as FormGroup).controls).forEach((c) => {
        c.markAsPristine();
        c.markAsUntouched();
      });
    }
  }

  onRemoveGame(title: string) {
    this.gamesService.removeGame(title);
  }
}
