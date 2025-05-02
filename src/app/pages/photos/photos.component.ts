import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PhotoGridComponent } from '../../components/photo-grid/photo-grid.component';
import { PhotosService } from '../../services/photos.service';
import { MatDialogModule } from '@angular/material/dialog';
import { EditPhotoDialogComponent } from 'src/app/components/edit-photo-dialog/edit-photo-dialog.component';

@Component({
  selector: 'app-photos',
  standalone: true,
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    PhotoGridComponent,
  ],
})
export class PhotosComponent {
  private photosService = inject(PhotosService);
  private snackBar = inject(MatSnackBar);

  // ngOnInit(): void {
  //   this.photosService.loadPhotos().subscribe();
  // }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      const file = element.files[0];

      // Check file type
      if (
        !file.type.includes('image/jpeg') &&
        !file.type.includes('image/png')
      ) {
        this.snackBar.open(
          'Apenas imagens JPEG e PNG são permitidas!',
          'Fechar',
          {
            duration: 3000,
          }
        );
        return;
      }

      this.photosService.uploadPhoto(file).subscribe({
        next: () => {
          this.snackBar.open('Foto adicionada com sucesso!', 'Fechar', {
            duration: 3000,
          });
          // Reset the file input
          element.value = '';
        },
        error: (error) => {
          console.error('Error uploading photo:', error);
          this.snackBar.open('Erro ao adicionar foto!', 'Fechar', {
            duration: 3000,
          });
        },
      });
    }
  }
}
