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
    const response = await fetch(`${this.API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email , password })
    });
    const data = await response.json();
    if (data.access) {
      this.saveToken( data.access, data.refresh)
      this.user = data.user.name;
      this.token = data.access;
      this.setAuth(true);
      this.router.navigate(['/dashboard']); // Redirige a la página de inicio después de iniciar sesión
    } 

    return data;
    
  
  }

  async setRegister(name: string,email: string, tel: string, password: string,password_confirmation: string){

    const response = await fetch(`${this.API_URL}/auth/request`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Asegúrate de establecer el encabezado
      },
      body: JSON.stringify({name,email,tel,password,password_confirmation}),
    })
    const data = await response.json();
    if (data.success) {
      return data 
    }else{ 
      return data
    }
  }

  async logout(){
    localStorage.removeItem('authToken'); 
      this.user = '';
      this.token = '';
      this.setAuth(false);
      this.router.navigate(['/login']); 
    
  }


  async checkAuth():Promise<void> {
   
    if(!this.getToken()){
      this.setAuth(false); 
      return
    }
    const response = await fetch(`${this.API_URL}/auth/checkAuth`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Asegúrate de establecer el encabezado
      },
      body: JSON.stringify({token: this.getToken().access}),
    });

    const data = await response.json();

    if(data.detail){
      this.setAuth(false); 
      return
    }else{
      this.setAuth(true);
      this.saveToken(this.getToken()!.access!,this.getToken()!.refresh!);
      this.router.navigate(['/dashboard']); 
      
    }

  }

  saveToken(access: string, refresh:string): void {
    localStorage.setItem('authToken', access); // Guardar el token en local storage
    localStorage.setItem('refreshToken', refresh); // Guardar el token en local storage
  }

  getToken(): any | null {
    return {
      'access':localStorage.getItem('authToken'),// Recuperar el token
      'refresh':localStorage.getItem('refreshToken'),// Recuperar el token
    }
  }


  async setCodigo(email:string,token1:string,token2:string){
    const token = token1+token2;
    const response = await fetch(`${this.API_URL}/auth/verify`,{
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
