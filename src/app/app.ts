import { Component, signal } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { RivalsComponent } from './rivals-component/rivals-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RivalsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ws-competitive');
}
