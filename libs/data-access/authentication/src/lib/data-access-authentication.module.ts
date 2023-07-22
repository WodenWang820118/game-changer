import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseAuthService } from './firebase-auth.service';

@NgModule({
  imports: [CommonModule],
  providers: [FirebaseAuthService],
})
export class DataAccessAuthenticationModule {}
