import { Injectable } from '@angular/core';
import { CountOpen } from '../interfaces/count-open';
import { CountClosed } from '../interfaces/count-closed';
import { WarehouseEnable } from '../interfaces/warehouse-enable';
import { environment } from '../../../../enviroment/enviroment';
import { AuthService } from '../../../auth.service';

@Injectable({
  providedIn: 'root'
})
export class WarehouseCountService {

  protected API_URL = environment.API_URL;
   
  constructor(private AuthService: AuthService) { }

  async getAllClosed() : Promise<CountClosed[]> {
    const data = await fetch(`${this.API_URL}/count/getCountsClosed`,{
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${this.AuthService.getToken().access}`,
          'Content-Type': 'application/json'
      }
    })
      return data.json() ?? {}

  }

  async getAllOpen():Promise<CountOpen[]>{

    const data = await fetch(`${this.API_URL}/count/getCountsOpen`,{
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${this.AuthService.getToken().access}`,
          'Content-Type': 'application/json'
      }
    })
      return data.json() ?? {}
  }

  async createCount(count: CountOpen): Promise<void> {
    const data = await fetch(`${this.API_URL}/count/create/`, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${this.AuthService.getToken().access}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(count)
    })
   return data.json() ?? {}
  }

  async getAllWarehousesEnabled(): Promise<WarehouseEnable[]> {
    const data = await fetch(`${this.API_URL}/count/warehouseEnable`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.AuthService.getToken().access}`,
        'Content-Type': 'application/json'
      }
    })
    return data.json() ?? []
  }
}
