import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  template: `
    <div class="about-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Sobre o Projeto</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>
            Este projeto foi desenvolvido como solução para a Questão 3 da
            avaliação técnica.
          </p>
          <p>
            Trata-se de uma aplicação Angular 16 que utiliza componentes
            standalone e signals para gerenciamento de estado. A aplicação
            permite visualizar, adicionar, editar e excluir fotos obtidas da API
            JSONPlaceholder.
          </p>
          <p>Tecnologias utilizadas:</p>
          <ul>
            <li>Angular 16</li>
            <li>Angular Material</li>
            <li>RxJS para manipulação de observables</li>
            <li>Cache local no navegador para persistência de dados</li>
            <li>Signals para gerenciamento de estado</li>
          </ul>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" routerLink="/menu">
            <mat-icon>arrow_back</mat-icon>
            Voltar para o Menu
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .about-container {
        display: flex;
        justify-content: center;
        padding: 40px 20px;
      }

      mat-card {
        max-width: 800px;
        width: 100%;
      }

      mat-card-header {
        margin-bottom: 20px;
      }

      mat-card-actions {
        display: flex;
        justify-content: flex-end;
        padding: 16px;
      }

      ul {
        list-style-type: disc;
        margin-left: 20px;
      }
    `,
  ],
})
export class AboutComponent {}
