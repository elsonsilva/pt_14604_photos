import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, map, of, tap } from 'rxjs';
import { Photo } from '../models/photo.model';

@Injectable({
  providedIn: 'root',
})
export class PhotosService {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com/photos';
  private readonly STORAGE_KEY = 'photo_cache';
  private readonly DELAY_MS = 750;

  // Signals
  public _photos = signal<Photo[]>([]);
  public _loading = signal<boolean>(false);
  public _currentPage = signal<number>(1);
  public _itemsPerPage = signal<number>(9);

  // Computed values
  // public photos = computed(() => this._photos());
  // public loading = computed(() => this._loading());
  // public currentPage = computed(() => this._currentPage());
  // public itemsPerPage = computed(() => this._itemsPerPage());
  public totalPages = computed(() =>
    Math.ceil(this._photos().length / this._itemsPerPage())
  );
  public paginatedPhotos = computed(() => {
    const startIndex = (this._currentPage() - 1) * this._itemsPerPage();
    const endIndex = startIndex + this._itemsPerPage();
    return this._photos().slice(startIndex, endIndex);
  });

  constructor(private http: HttpClient) {
    this.loadFromCache();
  }

  private loadFromCache(): void {
    const cachedPhotos = localStorage.getItem(this.STORAGE_KEY);
    if (cachedPhotos) {
      this._photos.set(JSON.parse(cachedPhotos));
    }
  }

  private saveToCache(photos: Photo[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(photos));
    this._photos.set(photos);
  }

  public loadPhotos(): Observable<Photo[]> {
    if (this._photos().length > 0) {
      return of(this._photos());
    }

    this._loading.set(true);

    return this.http.get<Photo[]>(this.API_URL).pipe(
      delay(this.DELAY_MS),
      tap((photos) => {
        this.saveToCache(photos);
        this._loading.set(false);
      }),
      catchError((error) => {
        console.error('Error loading photos:', error);
        this._loading.set(false);
        return of([]);
      })
    );
  }

  public addPhoto(photo: Partial<Photo>): void {
    const newPhoto: Photo = {
      albumId: 1,
      id: this.generateNewId(),
      title: photo.title || 'New Photo',
      url: photo.url || '',
      thumbnailUrl: photo.thumbnailUrl || photo.url || '',
    };

    const updatedPhotos = [newPhoto, ...this._photos()];
    this.saveToCache(updatedPhotos);
    this._currentPage.set(1); // Return to first page
  }

  public updatePhoto(id: number, data: Partial<Photo>): void {
    const photos = this._photos();
    const index = photos.findIndex((photo) => photo.id === id);

    if (index !== -1) {
      const updatedPhoto = { ...photos[index], ...data };
      const updatedPhotos = [...photos];
      updatedPhotos[index] = updatedPhoto;
      this.saveToCache(updatedPhotos);
    }
  }

  public deletePhoto(id: number): void {
    const updatedPhotos = this._photos().filter((photo) => photo.id !== id);
    this.saveToCache(updatedPhotos);

    // Adjust current page if necessary
    if (this.paginatedPhotos().length === 0 && this._currentPage() > 1) {
      this._currentPage.update((page) => page - 1);
    }
  }

  public setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this._currentPage.set(page);
    }
  }

  private generateNewId(): number {
    const ids = this._photos().map((photo) => photo.id);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
  }

  // Method to handle file upload
  public uploadPhoto(file: File): Observable<Photo> {
    return new Observable<Photo>((observer) => {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        const imageUrl = event.target.result;

        const newPhoto: Photo = {
          albumId: 1,
          id: this.generateNewId(),
          title: file.name,
          url: imageUrl,
          thumbnailUrl: imageUrl,
        };

        this.addPhoto(newPhoto);
        observer.next(newPhoto);
        observer.complete();
      };

      reader.onerror = (error) => {
        observer.error(error);
      };

      reader.readAsDataURL(file);
    });
  }
}
