import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  private session = signal<string>('testsession1');
  public currentSession = this.session.asReadonly();

  setSession() {}
}
