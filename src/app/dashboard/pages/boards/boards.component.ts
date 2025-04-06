import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BoardService } from '../../services/board.service';
import { KanbanBoard } from '../../interfaces/kanban-models.interface';
import { BoardModalComponent } from '../../components/board-modal/board-modal.component';
import { AddBoardRequest } from '../../interfaces/add-board-request.interface';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-boards',
  imports: [CommonModule, MatCardModule, MatIconModule,MatProgressSpinnerModule],
  template: `
  <div class="boards-template">
  <mat-card appearance="outlined" class="card" (click)="addBoard()">
    <mat-card-subtitle> 
      <mat-icon>add</mat-icon> 
    </mat-card-subtitle>
  </mat-card>

  @if(isLoading()){
    <div class="mat-spinner-container">
      <mat-spinner  [diameter]="50"></mat-spinner>
    </div>
  }
  
  @for (board of boards(); track board.idBoard) {
    <mat-card appearance="outlined" (click)="goToBoard(board.idBoard)" style="width:110px; height:110px;cursor: pointer;">
      <mat-card-title class="pt-2 text-center">
        {{board.title | slice:0:8 }}

      </mat-card-title>
      <mat-card-content class="pt-2 text-center">
        {{board.description | slice:0:14}}</mat-card-content>
    </mat-card>
  }
  </div>
  `,
  styleUrl: './boards.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BoardsComponent implements OnInit {
  private boardService = inject(BoardService);
  private router = inject(Router);
  readonly dialog = inject(MatDialog);
  private authService = inject(AuthService);
  public isLoading = signal(true);

  ngOnInit(): void {
    this.getAllBoards();
  }

  public boards = signal<KanbanBoard[]>([]);

  goToBoard(id:number): void {
    this.router.navigate(["/dashboard/boards", id]);
  }

  addBoard(){
      const dialogRef = this.dialog.open(BoardModalComponent, {
        data: null,
      });
  
      dialogRef.afterClosed().subscribe(result => {
        
        if (result !== undefined) {
          const addBoardReq:AddBoardRequest = result;
          this.boardService.addBoard(addBoardReq).subscribe(
            (resp) => {
              this.getAllBoards();
            }
          );
        }
      });
  }

  getAllBoards():void{
    this.boardService.getAllBoards(this.authService.user!.id!)
    .pipe(
      catchError((err)=>{
        this.isLoading.set(false);
        return of();
      })
    )
    .subscribe(
      (boards: KanbanBoard[]) => {
        this.isLoading.set(false);
        this.boards.set(boards);
      }
    );
  }

 }
