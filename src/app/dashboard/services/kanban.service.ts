import { Injectable, signal } from '@angular/core';
import { KanbanCard, KanbanColumn } from '../interfaces/kanban-models.interface';

@Injectable({
  providedIn: 'root',
})
export class KanbanService {
  columns = signal<KanbanColumn[]>([]);

  setColumns(columns:KanbanColumn[]):void{
    this.columns.set(columns);
  }

  addColumn(id:number,title:string){
    const currentColumns = this.columns();
    const newColumn = {idColumn:id,title,cards:[],order: currentColumns.length + 1};
    currentColumns.push(newColumn);
    this.columns.set([...currentColumns]);
  }

  moveCard(cardId: number, sourceColumnId: number, destinationColumnId: number, newIndex: number): void {
    const currentColumns = this.columns();
    const sourceColumn = currentColumns.find((col) => col.idColumn === sourceColumnId);
    const destColumn = currentColumns.find((col) => col.idColumn === destinationColumnId);

    if (!sourceColumn || !destColumn) return;

    const cardIndex = sourceColumn.cards.findIndex((card) => card.idCard === cardId);
    if (cardIndex === -1) return;

    const [movedCard] = sourceColumn.cards.splice(cardIndex, 1);

    destColumn.cards.splice(newIndex, 0, movedCard);

    this.updateCardOrders(currentColumns);

    this.columns.set([...currentColumns]);
  }

  moveCardWithinColumn(columnId: number, oldIndex: number, newIndex: number): void {
    const currentColumns = this.columns();
    const column = currentColumns.find((col) => col.idColumn === columnId);

    if (!column) return;

    const cards = column.cards;
    const [movedCard] = cards.splice(oldIndex, 1);
    cards.splice(newIndex, 0, movedCard);

    this.updateCardOrders(currentColumns);

    this.columns.set([...currentColumns]);
  }

  addCard(columnId: number, card: KanbanCard): void {
    const currentColumns = this.columns();
    const column = currentColumns.find((col) => col.idColumn === columnId);
    if (!column) return;

    const newCard: KanbanCard = {
      ...card,
      order: column.cards.length + 1,
    };

    column.cards.push(newCard);

    this.columns.set([...currentColumns]);
  }

  deleteCard(columnId: number, cardId: number): void {
    const currentColumns = this.columns();
    const column = currentColumns.find((col) => col.idColumn === columnId);

    if (!column) return;

    column.cards = column.cards.filter((card) => card.idCard !== cardId);
    this.updateCardOrders(currentColumns);

    this.columns.set([...currentColumns]);
  }

  updateCard(columnId: number, card: KanbanCard): void {
    const currentColumns = this.columns();
    const column = currentColumns.find((col) => col.idColumn === columnId);
    
    if (!column) return;

    const cardToupdate = column.cards.find((cardSearch) => cardSearch.idCard === card.idCard);

    if (cardToupdate) {
      cardToupdate.description = card.description;
      cardToupdate.title = card.title;
    }

    this.columns.set([...currentColumns]);
  }

  getCard(columnId: number, cardId: number):KanbanCard | undefined{
    const currentColumns = this.columns();
    const column = currentColumns.find((col) => col.idColumn === columnId);
    
    if (!column) return;

    const cardFind = column.cards.find((cardSearch) => cardSearch.idCard === cardId);
    return cardFind;
  }

  getColumn(columnId:number): KanbanColumn | undefined {
    const columns = this.columns();
    const column = columns.find((col) => col.idColumn == columnId);
    return column;
  }


  private updateCardOrders(columns: KanbanColumn[]): void {
    columns.forEach((column) => {
      column.cards.forEach((card, index) => {
        card.order = index + 1;
      });
    });
  }

  moveColumn(oldIndex: number, newIndex: number): void {
    const currentColumns = [...this.columns()];
    
    const [movedColumn] = currentColumns.splice(oldIndex, 1);
    
    currentColumns.splice(newIndex, 0, movedColumn);
    
    this.updateColumnOrders(currentColumns);
    
    this.columns.set(currentColumns);
  }
  
  private updateColumnOrders(columns: KanbanColumn[]): void {
    columns.forEach((column, index) => {
      column.order = index + 1;
    });
  }
}
