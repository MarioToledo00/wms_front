import { Injectable } from '@angular/core';
import { Router } from '@angular/router'; // Importa Router
import { UserInterface } from './views/users/interface/user-interface';
import { environment } from '../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  protected API_URL = environment.API_URL;
  private isAuthenticated = false; // Cambia esto según tu lógica
  private user = '';
  private token = '';

  constructor(private router: Router) { } // Inyecta Router

  isLoggedIn(): boolean {
    // Comprueba si existe un token (o cualquier dato que determines como indicador de sesión activa)
    return this.isAuthenticated;
  }

  setAuth(state: boolean) {
    this.isAuthenticated = state;
  }

  async setLoggin(email: string, password: string) {
    // const response = await fetch(`${this.API_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ email, password })
    // });
    // const data = await response.json();
    // if (data.success) {
    //   this.saveToken( data.user.access_token)
    //   this.user = data.user.email;
    //   this.token = data.user.access_token;
    //   this.setAuth(true);
      
    //   return data;
    // } else {
    //   return data;
    // }
    this.saveToken( 'token')
      this.user = 'email';
      this.token = 'token';
      this.setAuth(true);
    return {
      success :true,
      message : 'Login'
    }
  }

  async setRegister(name: string,email: string, tel: string, password: string,password_confirmation: string,emailAdmin: string){

    const response = await fetch(`${this.API_URL}/solicitud`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Asegúrate de establecer el encabezado
      },
      body: JSON.stringify({name,email,tel,password,password_confirmation,emailAdmin}),
    })
    const data = await response.json();
    if (data.success) {
      return data 
    }else{ 
      return data
    }
  }

  async logout(){
    localStorage.removeItem('access_token'); 
      this.user = '';
      this.token = '';
      this.setAuth(false);
      this.router.navigate(['/login']); 
    
  }


  async checkAuth():Promise<void> {
    const response = await fetch(`${this.API_URL}/checkAuth`,{
      method: 'GET'
    });

    const data = await response.json();

    if(data.success){
      this.setAuth(true);
      this.router.navigate(['/dashboard']); 
    }

  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token); // Guardar el token en local storage
  }

  getToken(): string | null {
    return localStorage.getItem('authToken'); // Recuperar el token
  }


  async setCodigo(email:string,token1:string,token2:string){
    const token = token1+token2;
    const response = await fetch(`${this.API_URL}/solicitud/confirmarCorreo`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Asegúrate de establecer el encabezado
      },
      body: JSON.stringify({email,token}),
    })
    const data = await response.json();
    if (data.success) {
      return data 
    }else{ 
      return data
    }
  }

}
