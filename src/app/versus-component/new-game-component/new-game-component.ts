import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GamesService } from '../games-service';

@Component({
  selector: 'app-versus-new-game-component',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './new-game-component.html',
  styleUrl: './new-game-component.css',
})
export class NewGameComponent {
  gamesService = inject(GamesService);

  gameFormControl = new FormControl('');

  onAddGame(event: MouseEvent) {
    event.preventDefault();
    const enteredTitle: string | any = this.gameFormControl.value ? this.gameFormControl.value : '';
    if (enteredTitle.trim()) {
      this.gamesService.addGame(enteredTitle);
    }
    this.gameFormControl.reset();
  }
}
