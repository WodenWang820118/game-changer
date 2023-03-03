import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'game-chapter-select',
  standalone: true,
  imports: [CommonModule, MatSelectModule],
  template: ` <mat-form-field appearance="fill" class="chapter-select">
    <mat-label>Chapter</mat-label>
    <mat-select #select>
      <mat-option value="1">Chapter 1</mat-option>
      <mat-option value="2">Chapter 2</mat-option>
    </mat-select>
  </mat-form-field>`,
  styleUrls: ['../../../styles.scss'],
})
export class ChapterSelectComponent {
  @ViewChild('select') select!: MatSelect;
}
