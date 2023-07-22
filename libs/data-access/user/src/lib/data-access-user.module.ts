import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseUserService } from './firebase-user.service';

@NgModule({
  imports: [CommonModule],
  providers: [FirebaseUserService],
})
export class DataAccessUserModule {}
