import { catchError, of, switchMap } from 'rxjs';
import { FirebaseAuthService } from '@game/data-access/authentication';
import { Directive, ElementRef, HostListener } from '@angular/core';
import { UserCredential } from 'firebase/auth';
import { FirebaseUserService } from '@game/data-access/user';

@Directive({
  standalone: true,
  selector: '[gameMenuItemLink]',
})
export class MenuItemLinkDirective {
  constructor(
    private el: ElementRef,
    private firebaseAuthService: FirebaseAuthService,
    private firebaseUserService: FirebaseUserService
  ) {}

  @HostListener('click') onClick() {
    if (this.el.nativeElement.innerText === 'Sign In') {
      this.firebaseAuthService
        .signInWithGoogle()
        .pipe(
          switchMap((credential: UserCredential) => {
            console.log('Signed in with Google');
            const user = credential.user;
            return this.firebaseUserService
              .checkUserExists(user)
              .pipe(
                switchMap(userExists =>
                  userExists
                    ? of(user)
                    : this.firebaseUserService.createUser(user)
                )
              );
          }),
          catchError(error => {
            console.warn('Failed to sign in with Google');
            return error;
          })
        )
        .subscribe();
    }
  }
}
