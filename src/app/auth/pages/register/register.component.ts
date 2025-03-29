import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ValidatorService } from '../../../shared/services/validator-service.service';

@Component({
  selector: 'app-register',
  imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
  ],
  template: `
  <form [formGroup]="myForm">
    <h2 class="mb-4">Registrate</h2>

    <mat-form-field class="w-100 mb-2 form-field" appearance="fill">
      <mat-label>Nombre Completo</mat-label>
      <input matInput formControlName="nombre" type="text" placeholder="Email de usuario">
      <mat-icon matSuffix>person</mat-icon>
    </mat-form-field>

    <mat-form-field class="w-100 mb-2 form-field" appearance="fill">
      <mat-label>Email</mat-label>
      <input matInput formControlName="email" type="text" placeholder="Email de usuario">
      <mat-icon matSuffix>person</mat-icon>
    </mat-form-field>

    <mat-form-field class="w-100 mb-4 form-field" appearance="fill">
      <mat-label>Password</mat-label>
      <input matInput formControlName="password" [type]="hide() ? 'password' : 'text'" placeholder="Password">
      <mat-icon matSuffix (click)="clickEvent($event)">{{ hide() ? 'visibility_off' : 'visibility' }}</mat-icon>
    </mat-form-field>

    <mat-form-field class="w-100 mb-4 form-field" appearance="fill">
      <mat-label>Confirm Password</mat-label>
      <input matInput formControlName="confirmPassword" [type]="hide() ? 'password' : 'text'" placeholder="Password">
      <mat-icon matSuffix (click)="clickEvent($event)">{{ hide() ? 'visibility_off' : 'visibility' }}</mat-icon>
    </mat-form-field>

    @if (isLoading()) {
      <div class="mat-spinner-container">
          <mat-spinner  [diameter]="50"></mat-spinner>
      </div>

    }
    @else {
      <button mat-button mat-flat-button color="primary" class="w-100" [disabled]="!myForm.valid" (click)="sendForm()">
        aceptar
      </button>
    }
  </form>
  `,
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private router: Router = inject(Router);
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private validatorService = inject(ValidatorService);
    public isLoading = signal<boolean>(false);
    public hide = signal(true);

    clickEvent(event: MouseEvent) {
      this.hide.set(!this.hide());
      event.stopPropagation();
      return;
    }

    public myForm: FormGroup = this.fb.group({
      nombre: ["", Validators.required],
      email: ["", [Validators.required,Validators.email]],
      password: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]]
    },
    {
      validator :[this.validatorService.isFieldOneEqualFieldTwo('password','confirmPassword')]
    }
    );


    sendForm() {
      if (!this.myForm.valid) { return; }
      
      const {confirmPassword, ...req} = this.myForm.value;
      req.usuarioCreacion = "system";
      
      this.isLoading.set(true);

      this.authService.register(req).subscribe(
        {
          next: () => {
            this.router.navigate([""]);
            this.isLoading.set(false);
          },
          error: (message:HttpErrorResponse) => {
            let mensaje: string = 'Error de comunicación.';
            if (typeof message.error ===  "string" ) mensaje = message.error;

            this.isLoading.set(false);
            Swal.fire({
              title: 'Error!',
              text: mensaje,
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          }
        }
      );
    }
}
