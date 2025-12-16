import { Component } from '@angular/core';
import { HeaderComponent } from './header-component/header-component';
import { RankingsComponent } from './rankings-component/rankings-component';
import { NewPlayerComponent } from './new-player-component/new-player-component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-rivals-component',
  imports: [HeaderComponent, RankingsComponent, NewPlayerComponent, MatCardModule],
  templateUrl: './rivals-component.html',
  styleUrl: './rivals-component.css',
})
export class RivalsComponent {}
