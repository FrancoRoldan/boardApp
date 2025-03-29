import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { BoardService } from '../../services/board.service';
import { KanbanCard, KanbanColumn } from '../../interfaces/kanban-models.interface';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, CdkDragHandle, DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { KanbanService } from '../../services/kanban.service';
import { MatDialog } from '@angular/material/dialog';
import { ColumnModalComponent } from '../../components/column-modal/column-modal.component';
import { TaskModalComponent } from '../../components/task-modal/task-modal.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UpdateCardRequest } from '../../interfaces/update-card.interface';

@Component({
  selector: 'app-board',
  imports: [CommonModule,CdkDragHandle, DragDropModule,MatCardModule,MatButtonModule,MatIconModule,FormsModule,MatDividerModule,MatProgressSpinnerModule],
  template: `
  @if(isLoading()){
    <div class="mat-spinner-container">
      <mat-spinner  [diameter]="50"></mat-spinner>
    </div>
  }
  @else{
    <div class="kanban-container">
      <button mat-fab (click)="addColumn()" class="action-button">
                <mat-icon>add</mat-icon>
      </button>
      @if(columns().length == 0){
        <h3>No hay columnas todavía</h3>
      }
      <div cdkDropList 
           class="kanban-board" 
           (cdkDropListDropped)="dropColumn($event)"
           [cdkDropListData]="columns()"
           cdkDropListOrientation="horizontal">
          @for(column of columns();  track $index){
            <div class="kanban-column" cdkDrag  [id]="column.idColumn.toString()"
                  >
              <h3 class="column-title" cdkDragHandle>
                {{column.title}}
              </h3>
              <mat-divider class="pb-2"></mat-divider>
              <button mat-fab extended (click)="AddTask(column.idColumn)">
                <mat-icon>add</mat-icon>
              </button>
              <div cdkDropList
                  [id]="column.idColumn.toString()"
                  [cdkDropListData]="column.cards"
                  (cdkDropListDropped)="drop($event)"
                  [cdkDropListConnectedTo]="getConnectedLists()"
                  class="card-list pt-2">

                  @for(card of column.cards; track card.idCard){
                    <mat-card 
                    [id]="card.idCard"
                    [@cardAnimation]
                    cdkDrag
                    appearance="outlined" class="kanban-card">
                    
                    <mat-card-title>{{card.title | slice:0:14}}
                      <button mat-icon-button (click)="deleteTask(column.idColumn, card.idCard)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </mat-card-title>
                      
                    <mat-card-content>{{card.description | slice:0:20}}</mat-card-content>
                    <div class="text-center">
                      <button mat-mini-fab (click)="editTask(column.idColumn,card)">
                          <mat-icon>edit</mat-icon>
                      </button>
                    </div>
                    
                    </mat-card>
                  }
              </div>
            </div>
          }
      </div>
    </div>
  }
  `,
  styleUrl: './board.component.css',
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BoardComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private boardService = inject(BoardService);
  private kanbanService = inject(KanbanService);
  
  readonly dialog = inject(MatDialog);

  public columns = this.kanbanService.columns;
  public isLoading = signal(true);
  public idBoard = signal(0);

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap(({id}) => this.boardService.getBoard(id)),
      catchError(() => {
        this.router.navigate(['/dashboard/bards']);
        return of();
      }),
    )
    .subscribe( board => { 
      this.kanbanService.setColumns(board.columns ?? []);
      this.idBoard.set(board.idBoard);
      this.isLoading.set(false);
    });
    
  }
    addColumn(){
      const dialogRef = this.dialog.open(ColumnModalComponent, {
        data: null,
        disableClose: true,
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result !== null) {
          let req = { 
            idBoard: this.idBoard(), 
            title:result.title
          };

          this.boardService.addColumn(req).subscribe(
            (column) => {
              this.kanbanService.addColumn(column.idColumn, column.title);
            }
          );
        }
      });
    }
  
    AddTask(columnId: number) {
      const dialogRef = this.dialog.open(TaskModalComponent, {
        data: null,
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result !== null) {
          const{idCard,...req} = result;
          req.idColumn = columnId;
          req.order = 0;
          this.boardService.addCard(req).subscribe(
            response => {
              this.kanbanService.addCard(columnId, response);
            }
          );
        }
      });
    }
  
    editTask(columnId:number,card:KanbanCard){
      const dialogRef = this.dialog.open(TaskModalComponent, {
        data: card,
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result !== null) {
          this.kanbanService.updateCard(columnId,result);
          this.updateCard(columnId,result.idCard);
        }
      });
    }
  
    deleteTask(columnId: number, cardId: number) {
      this.kanbanService.deleteCard(columnId, cardId);
    }
  
    getConnectedLists(): string[] {
      return this.columns().map(column => column.idColumn.toString());
    }
  
    drop(event: CdkDragDrop<KanbanCard[]>) {
      const sourceColumnId = parseInt(event.previousContainer.id);
      const destinationColumnId = parseInt(event.container.id);
      const cardId = parseInt(event.item.element.nativeElement.id);

      if (event.previousContainer === event.container) {
        this.kanbanService.moveCardWithinColumn(
          sourceColumnId,
          event.previousIndex,
          event.currentIndex
        );
        
        this.updateCard(sourceColumnId,cardId);

      } else {
        this.kanbanService.moveCard(
          cardId,
          sourceColumnId,
          destinationColumnId,
          event.currentIndex
        );
        
        this.updateCard(destinationColumnId,cardId);
      }
    }

    updateCard(columnId: number,cardId:number):void {
      let kanbanCard  = this.kanbanService.getCard(columnId,cardId);
      if(kanbanCard){
        const cardToUpdate: UpdateCardRequest = { 
          idCard: cardId, 
          idColumn: columnId, 
          title: kanbanCard.title,
          description: kanbanCard.description,
          order: kanbanCard.order
        };

        this.boardService.updateCard(cardToUpdate).subscribe();
      }
    }

    dropColumn(event: CdkDragDrop<KanbanColumn[]>) {
      const columnId = parseInt(event.item.element.nativeElement.id);
      this.kanbanService.moveColumn(
        event.previousIndex,
        event.currentIndex
      );
      const column : KanbanColumn | undefined = this.kanbanService.getColumn(columnId);
      const req = { idBoard:this.idBoard(), idColumn:columnId, title: column?.title ?? '', order:column?.order ?? 0 };
      this.boardService.updateColumn(req).subscribe(); 
    }

  
}
