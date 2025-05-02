import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Photo } from '../../models/photo.model';

@Component({
  selector: 'app-edit-photo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <h2 mat-dialog-title>Editar Foto</h2>
    <div mat-dialog-content>
      <mat-form-field appearance="fill" style="width: 100%">
        <mat-label>Título da foto</mat-label>
        <input matInput [(ngModel)]="data.title" />
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSave()">
        Salvar
      </button>
    </div>
  `,
})
export class EditPhotoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditPhotoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<Photo>
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data);
  }
}
