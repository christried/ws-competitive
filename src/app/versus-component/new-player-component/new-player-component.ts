import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PlayersService } from '../players-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-versus-new-player-component',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './new-player-component.html',
  styleUrl: './new-player-component.css',
})
export class NewPlayerComponent {
  team = input.required<1 | 2>();

  playersService = inject(PlayersService);

  playerFormControl = new FormControl('');

  onAddPlayer(event: MouseEvent) {
    event.preventDefault();
    const enteredName = this.playerFormControl.value?.trim() ?? '';

    if (enteredName) {
      this.playersService.addPlayer(enteredName, this.team()); // Pass team to service
    }
    this.playerFormControl.reset();
  }
}
