import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PhotosService } from '../../services/photos.service';
import { EditPhotoDialogComponent } from '../edit-photo-dialog/edit-photo-dialog.component';
import { Photo } from '../../models/photo.model';

@Component({
  selector: 'app-photo-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="grid-container">
      @if (photosService.loading()) {
      <div class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Carregando fotos...</p>
      </div>
      } @else {
      <div class="photos-grid">
        <mat-grid-list [cols]="getColumns()" rowHeight="1:1" gutterSize="16px">
          @for (photo of photosService.paginatedPhotos(); track photo.id) {
          <mat-grid-tile>
            <div class="photo-card">
              <img
                [src]="photo.thumbnailUrl"
                [alt]="photo.title"
                class="photo-image"
              />
              <div class="photo-actions">
                <button
                  mat-icon-button
                  color="warn"
                  (click)="deletePhoto(photo.id)"
                >
                  <mat-icon>delete</mat-icon>
                </button>
                <button
                  mat-icon-button
                  color="primary"
                  (click)="editPhoto(photo)"
                >
                  <mat-icon>edit</mat-icon>
                </button>
              </div>
              <div class="photo-title">{{ photo.title }}</div>
            </div>
          </mat-grid-tile>
          }
        </mat-grid-list>

        <mat-paginator
          [length]="photosService.photos().length"
          [pageSize]="photosService.itemsPerPage()"
          [pageIndex]="photosService.currentPage() - 1"
          (page)="onPageChange($event)"
          showFirstLastButtons
        >
        </mat-paginator>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .grid-container {
        width: 80%;
        margin: 0 auto;
        padding: 20px 0;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 300px;
      }

      .photo-card {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .photo-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .photo-actions {
        position: absolute;
        top: 8px;
        right: 8px;
        display: flex;
        gap: 8px;
        background-color: rgba(255, 255, 255, 0.7);
        border-radius: 4px;
        padding: 2px;
      }

      .photo-title {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 8px;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    `,
  ],
})
export class PhotoGridComponent {
  photosService = inject(PhotosService);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  getColumns(): number {
    const width = window.innerWidth;
    if (width < 600) return 1;
    if (width < 960) return 2;
    return 3;
  }

  onPageChange(event: PageEvent): void {
    this.photosService.setPage(event.pageIndex + 1);
  }

  deletePhoto(id: number): void {
    this.photosService.deletePhoto(id);
    this.snackBar.open('Foto excluída com sucesso!', 'Fechar', {
      duration: 3000,
    });
  }

  editPhoto(photo: Photo): void {
    const dialogRef = this.dialog.open(EditPhotoDialogComponent, {
      width: '400px',
      data: { ...photo },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.photosService.updatePhoto(photo.id, result);
        this.snackBar.open('Foto atualizada com sucesso!', 'Fechar', {
          duration: 3000,
        });
      }
    });
  }
}
