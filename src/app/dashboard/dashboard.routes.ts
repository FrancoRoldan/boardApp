import { Routes } from "@angular/router";
import { LayoutComponent } from "./pages/layout.component";

export const routes: Routes = [
    {
      path:"",
      component: LayoutComponent,
      children:[
        { path:"boards/:id", loadComponent: ()=> import('./pages/board/board.component') },
        { path:"boards",title:"Boards", loadComponent: ()=> import('./pages/boards/boards.component') },
        
        { path:"**", redirectTo:"boards"}
      ]
    }
  ];