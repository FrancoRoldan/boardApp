export interface KanbanCard {
    idCard: number;
    title: string;
    description: string;
    order: number;
  }
  
export interface KanbanColumn {
    idColumn: number;
    title: string;
    cards: KanbanCard[];
    order: number;
}

export interface KanbanBoard{
  idBoard:number;
  title:string;
  description:string;
}