import { Routes } from '@angular/router';
import { MenuComponent } from './pages/menu/menu.component';
import { PhotosComponent } from './pages/photos/photos.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'menu', component: MenuComponent },
  { path: 'fotos', component: PhotosComponent },
  { path: 'sobre', component: AboutComponent },
  { path: '**', redirectTo: 'menu' },
];
