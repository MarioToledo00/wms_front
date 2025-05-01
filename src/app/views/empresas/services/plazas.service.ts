import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroment/enviroment';
import { AuthService } from '../../../auth.service';
import { Plaza } from '../interfaces/plaza'

@Injectable({
  providedIn: 'root'
})
export class PlazasService {

    protected API_URL = environment.API_URL;
     // This is a list of users
    constructor(private AuthService: AuthService) { }

    async getPlazaList(): Promise <Plaza[]> {
        const data = await fetch(`${this.API_URL}/plazas`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.AuthService.getToken()}`,
                'Content-Type': 'application/json'
            }
        })
        return data.json() ?? []
          
    }

    async setRegister(nombre:string,empresa_id:number,edit:boolean,plaza_id:number){

        const url = edit ? 'plazas/edit':'plazas';
        
        
        const response = await fetch(`${this.API_URL}/${url}`,{
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${this.AuthService.getToken()}`,
            'Content-Type': 'application/json',  // Asegúrate de establecer el encabezado
            },
            body: JSON.stringify({nombre,empresa_id,plaza_id}),
        });

        return response.json() ?? {};
      
    }

    async setDeletePlaza(id:number){
        const response = await fetch(`${this.API_URL}/plazas/delete`,{
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