import { FirebaseAuthService } from '@game/data-access/authentication';
import { Directive, ElementRef, HostListener } from '@angular/core';
import { FirebaseUserService } from '@game/data-access/user';
import { LoginInterfaceComponent } from '../components/login-interface/login-interface.component';
import { catchError, of, switchMap } from 'rxjs';
import { UserCredential } from 'firebase/auth';
@Directive({
  standalone: true,
  selector: '[gameMenuItemLink]',
})
export class MenuItemLinkDirective {
  private username: string | null = '';

  constructor(
    private el: ElementRef,
    private firebaseAuthService: FirebaseAuthService,
    private firebaseUserService: FirebaseUserService
  ) {}

  @HostListener('click') onClick() {
    // TODO: refactor the code to be used in a service
    // TODO: drop the directive and use a service instead
    if (this.el.nativeElement.innerText === 'Sign In') {
      LoginInterfaceComponent.prototype.isOpen = true;
      console.warn('Signing in with Google');
      console.warn(LoginInterfaceComponent.prototype.isOpen);
      // TODO: show provides multiple ways to sign in (Google, GitHub, etc.)
      this.firebaseAuthService
        .signInWithGoogle()
        .pipe(
          switchMap((credential: UserCredential) => {
            console.log('Signed in with Google');
            const user = credential.user;
            return this.firebaseUserService.checkUserExists(user).pipe(
              switchMap(userExists => {
                if (userExists) {
                  this.el.nativeElement.innerText = user.displayName;
                  this.username = user.displayName;
                  console.warn('User already exists');
                  console.warn('User: ', user);
                  return of(user);
                } else {
                  console.warn('User does not exist');
                  this.firebaseUserService.createUser(user);
                  this.el.nativeElement.innerText = user.displayName;
                  console.warn('User: ', user);
                  this.username = user.displayName;
                  return of(user);
                }
              })
            );
          }),
          catchError(error => {
            console.warn('Failed to sign in with Google');
            return error;
          })
        )
        .subscribe();
    }
    if (this.el.nativeElement.innerText === this.username) {
      // it works
      // TODO: after clicking on the username, the menu should route to the user's profile page
      console.warn('Successfully signed in with Google');
    }
  }
}
