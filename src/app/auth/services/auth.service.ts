import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../interfaces/login-response.interface';
import { LoginRequest } from '../interfaces/login-request.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { RefreshTokenResponse } from '../interfaces/refresh-token-response.interface';
import { RegisterRequest } from '../interfaces/register-request.interface';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private urlApi:string = environment.baseUrl;
  public user:User |null = null;

  constructor() {
    if(!this.user && localStorage.getItem("user")){
      this.user = JSON.parse(localStorage.getItem("user") || "");
    }
   }

  saveTokenLocalStorage(token:string){
    localStorage.setItem("token", token);
  }

  getTokenLocalStorage():string | null {
    return localStorage.getItem("token");
  }

  login(req:LoginRequest):Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.urlApi}/auth/login`, req)
     .pipe(
      tap(res => {
        this.saveTokenLocalStorage(res.token);
        this.user = res.user;
        localStorage.setItem("user", JSON.stringify(this.user));
      })
     );
  }

  register(req:RegisterRequest):Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.urlApi}/user/register`, req)
     .pipe(
      tap(res => {
        this.saveTokenLocalStorage(res.token);
        this.user = res.user;
        localStorage.setItem("user", JSON.stringify(this.user));
      })
     );
  }

  refreshToken():Observable<RefreshTokenResponse>{
    const headers = { authorization : `Bearer ${this.getTokenLocalStorage() ?? ""}` };
    return this.http.post<RefreshTokenResponse>(`${this.urlApi}/auth/refresh`,null, { headers })
    .pipe(
      tap( newToken => this.saveTokenLocalStorage(newToken.token), )
    );
  }

  logout():void{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.router.navigate(["auth"]);
  }


}
