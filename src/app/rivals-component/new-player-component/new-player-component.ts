import { Component, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PlayersService } from '../players-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-player-component',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './new-player-component.html',
  styleUrl: './new-player-component.css',
})
export class NewPlayerComponent {
  playersService = inject(PlayersService);

  playerFormControl = new FormControl('');

  constructor() {
    effect(() => {
      if (this.playersService.isLocked()) {
        this.playerFormControl.disable();
      } else {
        this.playerFormControl.enable();
      }
    });
  }

  onAddPlayer(event: MouseEvent) {
    event.preventDefault();
    const enteredName: string | any = this.playerFormControl.value
      ? this.playerFormControl.value
      : '';
    if (enteredName.trim()) {
      this.playersService.addPlayer(enteredName);
    }
    this.playerFormControl.reset();
  }

  onLockPlayers() {
    this.playersService.toggleLock();
  }
}
