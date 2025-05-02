import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PhotoGridComponent } from '../../components/photo-grid/photo-grid.component';
import { PhotosService } from '../../services/photos.service';

@Component({
  selector: 'app-photos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    PhotoGridComponent,
  ],
  template: `
    <div class="photos-container">
      <div class="header">
        <h1>Galeria de Fotos</h1>
        <div class="actions">
          <input
            type="file"
            #fileInput
            style="display: none"
            accept="image/jpeg,image/png"
            (change)="onFileSelected($event)"
          />
          <button mat-raised-button color="primary" (click)="fileInput.click()">
            <mat-icon>add_photo_alternate</mat-icon>
            Adicionar Foto
          </button>
          <button mat-raised-button routerLink="/menu">
            <mat-icon>arrow_back</mat-icon>
            Voltar para o Menu
          </button>
        </div>
      </div>

      <app-photo-grid></app-photo-grid>
    </div>
  `,
  styles: [
    `
      .photos-container {
        padding: 20px;
      }

      .header {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20px;

        @media (min-width: 768px) {
          flex-direction: row;
          justify-content: space-between;
          margin-left: 10%;
          margin-right: 10%;
        }
      }

      .actions {
        display: flex;
        gap: 16px;
        margin-top: 16px;

        @media (min-width: 768px) {
          margin-top: 0;
        }
      }
    `,
  ],
})
export class PhotosComponent implements OnInit {
  private photosService = inject(PhotosService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.photosService.loadPhotos().subscribe();
  }

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
