import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormControl } from '@angular/forms';
import { FirebaseAuthService } from '@game/data-access/authentication';
import { of, switchMap, catchError } from 'rxjs';
import { User, UserCredential } from 'firebase/auth';
import { FirebaseUserService } from '@game/data-access/user';

@Component({
  selector: 'game-login-interface',
  standalone: true,
  imports: [
    CommonModule,
    OverlayModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
  ],
  styleUrls: ['../../../styles.scss', './login-interface.component.scss'],
  template: `
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOpen]="isOpen"
      [cdkConnectedOverlayOrigin]="trigger">
      <div class="login">
        <div class="login__close" (click)="closeOverlay()">
          <mat-icon>highlight_off</mat-icon>
        </div>
        <div class="login__title"><h2>The Game Changer</h2></div>
        <div class="login__options">
          <form class="login__options__email">
            <mat-form-field appearance="fill">
              <mat-label>Email</mat-label>
              <input matInput type="text" placeholder="Email" />
              <mat-error
                *ngIf="
                  emailFormControl.hasError('email') &&
                  !emailFormControl.hasError('required')
                "
                >Please enter a valid email address</mat-error
              >
              <mat-error *ngIf="emailFormControl.hasError('required')">
                Email is <strong>required</strong>
              </mat-error>
            </mat-form-field>
            <mat-form-field appearance="fill">
              <mat-label>Password</mat-label>
              <input matInput type="password" placeholder="Password" />
              <mat-error
                *ngIf="
                  emailFormControl.hasError('password') &&
                  !emailFormControl.hasError('required')
                "
                >Invalid password</mat-error
              >
              <mat-error *ngIf="emailFormControl.hasError('required')">
                Email is <strong>required</strong>
              </mat-error>
            </mat-form-field>
          </form>
          <div class="login__options__actions">
            <button mat-button>Sign up</button>
            <button mat-stroked-button color="blue">Login</button>
          </div>
          <div class="login__options__divider">
            <div class="line"></div>
            <span>or log in with</span>
            <div class="line"></div>
          </div>
          <div class="login__options__social">
            <img
              src="./assets/fb-icon.svg"
              alt="fb-icon"
              width="40px"
              (click)="socialLogin('facebook')" />
            <img
              src="./assets/line-icon.svg"
              alt="line-icon"
              width="40px"
              (click)="socialLogin('line')" />
            <img
              src="./assets/google-icon.svg"
              alt="google-icon"
              width="40px"
              (click)="socialLogin('google')" />
          </div>
        </div>
      </div>
    </ng-template>
  `,
})
export class LoginInterfaceComponent {
  @Input() isOpen = false;
  @Input() trigger!: ElementRef;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() userData = new EventEmitter<User | null>();
  emailFormControl: FormControl = new FormControl('');

  constructor(
    private firebaseAuthService: FirebaseAuthService,
    private firebaseUserService: FirebaseUserService
  ) {}

  closeOverlay() {
    this.closeEvent.emit();
  }

  socialLogin(platForm: string) {
    // TODO: implement social login
    console.warn('Social login not implemented');
    if (platForm === 'google') {
      this.firebaseAuthService
        .signInWithGoogle()
        .pipe(
          switchMap((credential: UserCredential) => {
            console.log('Signed in with Google');
            const user = credential.user;
            return this.firebaseUserService.checkUserExists(user).pipe(
              switchMap(userExists => {
                if (userExists) {
                  console.warn('User already exists');
                  console.warn('User: ', user);
                  this.userData.emit(user);
                  return of(user);
                } else {
                  console.warn('User does not exist');
                  this.firebaseUserService.createUser(user);
                  console.warn('User: ', user);
                  this.userData.emit(user);
                  return of(user);
                }
              })
            );
          }),
          catchError(error => {
            console.warn('Failed to sign in with Google');
            this.userData.emit(null);
            return error;
          })
        )
        .subscribe();
    }
    if (platForm === 'facebook') {
      console.warn('Facebook login not implemented');
    }
    if (platForm === 'line') {
      console.warn('Line login not implemented');
    }
  }
}
