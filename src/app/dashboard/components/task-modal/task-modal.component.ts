import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { KanbanCard } from '../../interfaces/kanban-models.interface';

@Component({
  selector: 'app-add-task',
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatInputModule],
  template: `
  @if(!card){
    <h2 mat-dialog-title>Agregar Tarea</h2>
  }
  @else {
    <h2 mat-dialog-title>Editar Tarea</h2>
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
        @if (form.controls['description'].hasError('required') && form.controls['description'].touched) {
          <mat-error>La descripción es obligatoria</mat-error>
        }
        <mat-form-field>
          <mat-label>descripcion</mat-label>
          <input matInput formControlName="description"/>
        </mat-form-field>
        
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button [disabled]="!this.form.valid" [mat-dialog-close]="onClick()">Aceptar</button>
        <button mat-button [mat-dialog-close]="onNoClick()">Cancelar</button>
      </mat-dialog-actions>
  </form>
  
  `,
  styleUrl: './task-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskModalComponent implements OnInit{
  public form!: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public card: KanbanCard | null){}

  ngOnInit(): void {
    this.form = this.fb.group({
      'idCard': [this.card?.idCard ?? this.generateId(), Validators.required],
      'title' : [this.card?.title,[Validators.required]],
      'description' : [this.card?.description,[Validators.required]],
      'order': [this.card?.order]
    });
  }
  
  private fb: FormBuilder = inject(FormBuilder);

  onNoClick(){
    return null;
  }

  onClick(){
    return this.form.value;
  }

  private generateId():number{
    return Math.floor(Math.random()* 100);
  }

}
