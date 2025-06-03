import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroment/enviroment';
import { AuthService } from '../../../auth.service';
import { Producto } from '../interface/producto';
import { Brand } from '../interface/brands';
import { Category } from '../interface/categories';
import { Inventario } from '../interface/inventario';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  protected API_URL = environment.API_URL;
  constructor(private AuthService: AuthService) { }

  async getProducts(): Promise<Inventario[]> {

    const data = await fetch(`${this.API_URL}/products/getAllProducts`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.AuthService.getToken().access}`,
        'Content-Type': 'application/json'
      }
    })

    return data.json() ?? []

  }

  async getBrands(): Promise<Brand[]> {

    const data = await fetch(`${this.API_URL}/products/getAllBrands`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.AuthService.getToken().access}`,
        'Content-Type': 'application/json'
      }
    })
    return data.json() ?? []

  }

  async getCategories(): Promise<Category[]> {

    const data = await fetch(`${this.API_URL}/products/getAllCategories`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.AuthService.getToken().access}`,
        'Content-Type': 'application/json'
      }
    })
    return data.json() ?? []

  }

}
