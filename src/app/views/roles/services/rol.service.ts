import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroment/enviroment';
import { AuthService } from '../../../auth.service';
import { Rol } from '../interfaces/rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {

    protected API_URL = environment.API_URL;
     // This is a list of users
    constructor(private AuthService: AuthService) { }

    async getRolesList(): Promise <Rol[]> {
        const data = await fetch(`${this.API_URL}/roles`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.AuthService.getToken()}`,
                'Content-Type': 'application/json'
            }
        })
        return data.json() ?? []
          
    }

    async setRegister(nombre:string,edit:boolean,rol_id:number,created_by:number=0){

        const url = edit ? 'roles/edit':'roles';
        
        
        const response = await fetch(`${this.API_URL}/${url}`,{
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${this.AuthService.getToken()}`,
            'Content-Type': 'application/json',  // Asegúrate de establecer el encabezado
            },
            body: JSON.stringify({nombre,created_by,rol_id}),
        });

        return response.json() ?? {};
      
    }

    async setDeleteRol(id:number){
        const response = await fetch(`${this.API_URL}/roles/delete`,{
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.AuthService.getToken()}`,
              'Content-Type': 'application/json',  // Asegúrate de establecer el encabezado
            },
            body: JSON.stringify({id}),
          })
         ;
          return response.json() ?? {};
    }
}