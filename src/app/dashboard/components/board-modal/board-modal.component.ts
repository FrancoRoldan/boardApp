import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { KanbanBoard } from '../../interfaces/kanban-models.interface';

@Component({
  selector: 'app-board-modal',
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatInputModule],
  template: `
  @if(!board){
    <h2 mat-dialog-title>Agregar Board</h2>
  }
  @else {
    <h2 mat-dialog-title>Editar Board</h2>
  }
  
  <form [formGroup]="form" >
      <mat-dialog-content class="form">

        <p>Título</p>
        @if (form.controls['title'].hasError('required') && form.controls['title'].touched) {
          <mat-error>El titulo es obligatorio</mat-error>
        }
        <mat-form-field>
          <mat-label>Titulo</mat-label>
          <input matInput cdkFocusInitial formControlName="title"/>
        </mat-form-field>
        <p>Descripcion</p>
        <mat-form-field>
          <mat-label>Descripción</mat-label>
          <input matInput formControlName="description"/>
        </mat-form-field>
      
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button [disabled]="!this.form.valid" [mat-dialog-close]="onClick()">Aceptar</button>
        <button mat-button [mat-dialog-close]="onNoClick()">Cancelar</button>
      </mat-dialog-actions>
  </form>
  `,
  styleUrl: './board-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardModalComponent {
  public form!: FormGroup;
  private fb: FormBuilder = inject(FormBuilder);

  constructor(@Inject(MAT_DIALOG_DATA) public board: KanbanBoard | null){}
  
  ngOnInit(): void {
    this.form = this.fb.group({
      'idBoard': [this.board?.idBoard ?? 0, Validators.required],
      'title' : [this.board?.title,[Validators.required]],
      'description':[this.board?.description,[]]
    });
  }
  
  onNoClick(){
    return null;
  }
  
  onClick(){
    return this.form.value;
  }
    
}
