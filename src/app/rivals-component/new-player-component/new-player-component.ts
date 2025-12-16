import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PlayersService } from '../players-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-player-component',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './new-player-component.html',
  styleUrl: './new-player-component.css',
})
export class NewPlayerComponent {
  playersService = inject(PlayersService);

  playerFormControl = new FormControl('');

  onAddPlayer() {
    const enteredName: string | any = this.playerFormControl.value;
    if (enteredName.trim()) {
      this.playersService.addPlayer(enteredName);
      console.log(this.playersService.playersData());
    }
    this.playerFormControl.reset();
  }
}
