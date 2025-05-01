import { Injectable } from '@angular/core';
import { Empresa } from '../interfaces/empresa'
import { Regimen } from '../interfaces/regimen'
import { environment } from '../../../../enviroment/enviroment';
import { AuthService } from '../../../auth.service';
import { Pais } from '../../locations/interfaces/pais'
import { Estado } from '../../locations/interfaces/estado'
import { Municipio } from '../../locations/interfaces/municipio'
import { Ciudad } from '../../locations/interfaces/ciudad'
import {SolicitudResponse} from '../../users/interface/solicitud-response';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  protected API_URL = environment.API_URL;
     // This is a list of users
    constructor(private AuthService: AuthService) { }
  
    async getEmpresasList(): Promise <Empresa[]> {
      const data = await fetch(`${this.API_URL}/empresas`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.AuthService.getToken()}`,
                'Content-Type': 'application/json'
            }
        })
      return data.json() ?? []
      
    }

    async getPaisesList(): Promise <Pais[]> {
      const data = await fetch(`${this.API_URL}/paises`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.AuthService.getToken()}`,
                'Content-Type': 'application/json'
            }
        })
      return data.json() ?? []
    }

    async getEstadosList(): Promise <Estado[]> {
      const data = await fetch(`${this.API_URL}/estados`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.AuthService.getToken()}`,
                'Content-Type': 'application/json'
            }
        })
      return data.json() ?? []
    }
    async getMunicipiosList(): Promise <Municipio[]> {
      const data = await fetch(`${this.API_URL}/municipios`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.AuthService.getToken()}`,
                'Content-Type': 'application/json'
            }
        })
      return data.json() ?? []
    }
    async getCiudadesList(): Promise <Ciudad[]> {
      const data = await fetch(`${this.API_URL}/ciudades`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.AuthService.getToken()}`,
                'Content-Type': 'application/json'
            }
        })
      return data.json() ?? []
    }

    async getRegimenesList(): Promise <Regimen[]>{

      const data = await fetch(`${this.API_URL}/regimenes`,{
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${this.AuthService.getToken()}`,
              'Content-Type': 'application/json'
          }
        })
      return data.json() ?? []

    }

    async setRegister(razon_social:string,nombre_comercial:string,registro_patronal:string,pais_id:number,estado_id:number,municipio_id:number,ciudad_id:number,codigo_postal:string,calle:string,numero_exterior:string,numero_interior:string,regimen_id:number,editEmpresa:boolean,empresa_Id:number): Promise <SolicitudResponse> {
      
      const url = editEmpresa ? 'empresas/edit':'empresas';
      let data ;
      if(editEmpresa){
        data = JSON.stringify({razon_social,nombre_comercial,registro_patronal,pais_id,estado_id,municipio_id,ciudad_id,codigo_postal,calle,numero_exterior,numero_interior,regimen_id,empresa_Id})
      }else{
        data = JSON.stringify({razon_social,nombre_comercial,registro_patronal,pais_id,estado_id,municipio_id,ciudad_id,codigo_postal,calle,numero_exterior,numero_interior,regimen_id})
      }

      const response = await fetch(`${this.API_URL}/${url}`,{
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.AuthService.getToken()}`,
          'Content-Type': 'application/json',  // Asegúrate de establecer el encabezado
        },
        body: data,
      })
     ;
      return response.json() ?? {};

    }

    async setDeleteEmpresa(id:number){
      const response = await fetch(`${this.API_URL}/empresas/delete`,{
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
