import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { KanbanBoard, KanbanCard, KanbanColumn } from '../interfaces/kanban-models.interface';
import { AddCardRequest } from '../interfaces/add-card-request.interface';
import { AddColumnRequest } from '../interfaces/add-column-request.interface';
import { AddBoardRequest } from '../interfaces/add-board-request.interface';
import { UpdateCardRequest } from '../interfaces/update-card.interface';
import { GetBoard } from '../interfaces/get-board.interface';
import { UpdateColumnRequest } from '../interfaces/update-column-request.interface';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private http = inject(HttpClient);
  private urlApi:string = environment.baseUrl;

  getAllBoards(idUsuario:number):Observable<KanbanBoard[]>{
    return this.http.get<KanbanBoard[]>(`${this.urlApi}/board/user/${idUsuario}`);
  }

  getBoard(idBoard:number):Observable<GetBoard> {
    return this.http.get<GetBoard>(`${this.urlApi}/board/${idBoard}`);
  }

  addBoard(req:AddBoardRequest):Observable<KanbanBoard>{
    return this.http.post<KanbanBoard>(`${this.urlApi}/board`,req);
  }

  addCard(req:AddCardRequest):Observable<KanbanCard>{
    return this.http.post<KanbanCard>(`${this.urlApi}/card`, req);
  }

  updateCard(req:UpdateCardRequest):Observable<KanbanCard>{
    return this.http.put<KanbanCard>(`${this.urlApi}/card`,req);
  }

  addColumn(req:AddColumnRequest):Observable<KanbanColumn>{
    return this.http.post<KanbanColumn>(`${this.urlApi}/column`, req);
  }

  updateColumn(req:UpdateColumnRequest):Observable<KanbanColumn>{
    return this.http.put<KanbanColumn>(`${this.urlApi}/column`,req);
  }  

}
