import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Menu } from '../../interfaces/menu.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-left-side-bar',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  template: `
        <mat-toolbar>
            <span>Menú</span>
            <span class="spacer"></span>
            @if(isMobile()){
              <button mat-icon-button (click)="toggle();">
                <mat-icon>close</mat-icon>
              </button>
            }
            
        </mat-toolbar>

        <mat-nav-list>
            @for(item of menuItems; track $index){
              <mat-list-item [routerLink]="item.url"  [routerLinkActiveOptions]="{exact:true}" 
              (click)="toggle()" routerLinkActive #rla="routerLinkActive"  [activated]="rla.isActive">
                <mat-icon color="primary" matListItemIcon>{{item.icon}}</mat-icon>
                {{item.tittle}}
              </mat-list-item> 
            }
        </mat-nav-list>
 `,
  styleUrl: './left-side-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftSideBarComponent { 
  toogleOutput = output<boolean>();
  isMobile = input.required<boolean>();

  menuItems:Menu[] = [
    {tittle: "boards", url: "/dashboard/boards", icon: "dashboard"},
  ];

    toggle() {
      if(this.isMobile()){
        this.toogleOutput.emit(true);
      }
      
    }
}
