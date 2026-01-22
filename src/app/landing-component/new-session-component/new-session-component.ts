import { Component, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SessionsService } from '../../sessions-service';

@Component({
  selector: 'app-new-session-component',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './new-session-component.html',
  styleUrl: './new-session-component.css',
})
export class NewSessionComponent {
  selectedApp = input.required<'rivals' | 'versus'>();
  sessionsService = inject(SessionsService);

  sessionFormControl = new FormControl('');

  onAddSession(event: MouseEvent) {
    event.preventDefault();
    const enteredSession: string | any = this.sessionFormControl.value
      ? this.sessionFormControl.value
      : '';
    if (enteredSession.trim()) {
      this.sessionsService.addSession(this.selectedApp(), enteredSession);
    }
    this.sessionFormControl.reset();
  }
}
