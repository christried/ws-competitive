import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SessionsService } from '../../sessions-service';
import { Router, RouterLink } from '@angular/router';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-versus-header-component',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent {
  sessionsService = inject(SessionsService);

  readonly dialog = inject(MatDialog);
  private router = inject(Router);

  onDeleteSession() {
    const dialogRef = this.dialog.open(SessionDeleteDialog, {
      width: '250px',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '100ms',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.sessionsService.deleteSession();
        this.router.navigate(['']);
      }
    });
  }
}

@Component({
  selector: 'versus-session-delete-dialog',
  templateUrl: 'session-delete-dialog.html',
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionDeleteDialog {
  readonly dialogRef = inject(MatDialogRef<SessionDeleteDialog>);
}
