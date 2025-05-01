import { Injectable } from '@angular/core';
import { UserInterface } from '../interface/user-interface';
import { environment } from '../../../../enviroment/enviroment';
import { AuthService } from '../../../auth.service';
import {SolicitudResponse} from '../interface/solicitud-response';
import { Rol } from '../interface/rol';

@Injectable({
  providedIn: 'root'
})
export class UsersserviceService {
  protected API_URL = environment.API_URL;
   // This is a list of users
  constructor(private AuthService: AuthService) { }

  UsersData :UserInterface[] = []
  RolesData :Rol[] = []

  async getAllUsersList(): Promise <UserInterface[]> {
    const data = await fetch(`${this.API_URL}/users`,{
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${this.AuthService.getToken()}`,
              'Content-Type': 'application/json'
          }
      })
    this.UsersData = await data.json();
    return this.UsersData  ?? []
  }

  async getUserById(id: number): Promise <UserInterface | undefined> {
    const data = await fetch(`${this.API_URL}/user/${id}`,{
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${this.AuthService.getToken()}`,
          'Content-Type': 'application/json'
      }
  })
    return data.json() ?? {}
  }

  async getSolUsersList() : Promise <UserInterface[]>{
    const data = await fetch(`${this.API_URL}/solicituduser`,{
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${this.AuthService.getToken()}`,
          'Content-Type': 'application/json'
      }
  })
    return data.json() ?? {}
  }

  async aceptarSolUsuario(solicitud: number, rol:number): Promise <SolicitudResponse>{
    const data = await fetch(`${this.API_URL}/users`,{
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${this.AuthService.getToken()}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ solicitud,rol })
    })
    return data.json() ?? {};

  }

  async rechazarSolUsuario(solicitud: number):Promise <SolicitudResponse>{
    const data = await fetch(`${this.API_URL}/solicituduser/${solicitud}`,{
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${this.AuthService.getToken()}`,
            'Content-Type': 'application/json'
        },
    })
    return data.json() ?? {};
  }

  async getRolesUsuarios():Promise <Rol[] | undefined>{
    const data = await fetch(`${this.API_URL}/roles`,{
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${this.AuthService.getToken()}`,
          'Content-Type': 'application/json'
      },
     // body: JSON.stringify({ solicitud })
    })
    this.RolesData= await data.json()
    return this.RolesData ?? {};
  }

  async setRegister(name: string,email: string, tel: string, password: string,password_confirmation: string,rol_id: number,activated_by:number = 0,user_admin:number=0): Promise <SolicitudResponse> {

    const response = await fetch(`${this.API_URL}/users/create`,{
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.AuthService.getToken()}`,
        'Content-Type': 'application/json',  // Asegúrate de establecer el encabezado
      },
      body: JSON.stringify({name,email,password,tel,rol_id,activated_by,user_admin}),
    });
    return response.json() ?? {};
  }

  async setEditRegister(email: string,name: string, tel: string, rol_id: number): Promise <SolicitudResponse> {

    const response = await fetch(`${this.API_URL}/users/edit`,{
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.AuthService.getToken()}`,
        'Content-Type': 'application/json',  // Asegúrate de establecer el encabezado
      },
      body: JSON.stringify({email,name,tel,rol_id}),
    });
    return response.json() ?? {};
  }

  async setDeleteUser(id:number){
    const response = await fetch(`${this.API_URL}/users/delete`,{
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.AuthService.getToken()}`,
        'Content-Type': 'application/json',  // Asegúrate de establecer el encabezado
      },
      body: JSON.stringify({id}),
    });
    return response.json() ?? {};
  }

}
