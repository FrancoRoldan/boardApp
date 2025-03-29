import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { AuthService } from "../../auth/services/auth.service";
import Swal from "sweetalert2";


export function LoginInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {  
  const token: string = localStorage.getItem("token") ?? '';
  const authService = inject(AuthService);
  
  if (req.url.includes('/login') || req.url.includes('/refresh')) {
    return next(req); 
  }

  const reqWithHeader = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  return next(reqWithHeader).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {

        return authService.refreshToken().pipe(
          switchMap(newToken => {

            const reqWithNewToken = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${newToken.token}`),
            });

            return next(reqWithNewToken);
          }),
          catchError(err => {
            console.error('Error refreshing token:', err);
            return throwError(()=>err);
          })
        );
      }
      
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      
      return throwError(()=>error);
    })
  );
}