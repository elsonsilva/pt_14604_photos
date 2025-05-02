import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
    MatDialogModule,
  ],
  templateUrl: './photo-grid.component.html',
  styleUrls: ['./photo-grid.component.scss'],
})
export class PhotoGridComponent implements OnInit {
  photosService = inject(PhotosService);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  // Adicione estas propriedades à classe
  imageStatus: { [key: number]: 'loading' | 'loaded' | 'error' } = {};

  ngOnInit(): void {
    // Se você já tiver um método ngOnInit, apenas adicione este código dentro dele
    this.photosService.loadPhotos().subscribe((photos) => {
      photos.forEach((photo) => {
        this.imageStatus[photo.id] = 'loading';
      });
    });
  }

  // Adicione estes métodos à classe
  handleImageError(event: Event, photoId: number): boolean {
    // Prevenir que o erro seja exibido no console
    event.preventDefault();
    event.stopPropagation();

    // Marcar a imagem como com erro
    this.imageStatus[photoId] = 'error';

    // Retornar true para indicar que o erro foi tratado
    return true;
  }

  handleImageLoad(photoId: number): void {
    this.imageStatus[photoId] = 'loaded';
  }

  getColumns(): number {
    const width = window.innerWidth;
    if (width < 600) return 1;
    if (width < 960) return 2;
    return 3;
  }

  trackByPhotoId(index: number, photo: Photo): number {
    return photo.id;
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
