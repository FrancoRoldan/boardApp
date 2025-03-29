import { KanbanColumn } from "./kanban-models.interface";

export interface GetBoard {
    idBoard: number;
    title:   string;
    columns: KanbanColumn[];
  }
  