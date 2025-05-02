import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  template: `
    <div class="menu-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Menu</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="button-container">
            <button mat-raised-button color="primary" routerLink="/fotos">
              <mat-icon>photo_library</mat-icon>
              Fotos
            </button>
            <button mat-raised-button color="accent" routerLink="/sobre">
              <mat-icon>info</mat-icon>
              Sobre
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .menu-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }

      mat-card {
        max-width: 400px;
        width: 100%;
      }

      mat-card-header {
        justify-content: center;
        margin-bottom: 20px;
      }

      .button-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      button {
        height: 48px;
      }
    `,
  ],
})
export class MenuComponent {}
