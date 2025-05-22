import { Component,CUSTOM_ELEMENTS_SCHEMA, inject, OnInit ,NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent,
  ModalBodyComponent,
  ModalComponent,
  ButtonDirective,
  ModalFooterComponent,
  ContainerComponent,
  ModalHeaderComponent,
  FormDirective,
  AlertComponent,
  FormControlDirective,
  TableDirective,
  FormModule,BadgeComponent }from '@coreui/angular'
import { FormControl, FormGroup, ReactiveFormsModule,FormsModule ,Validators} from '@angular/forms';
import { Producto } from '../interface/producto';
import { Brand } from '../interface/brands';
import { Category } from '../interface/categories';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-lista-productos',
  imports: [SpinnerComponent,ReactiveFormsModule,FormsModule ,
  ModalBodyComponent,
  ModalComponent,
  ButtonDirective,
  ModalFooterComponent,
  ContainerComponent,
  ModalHeaderComponent,
  FormDirective,
  AlertComponent,
  FormControlDirective,
  TableDirective,BadgeComponent,
  FormModule,CommonModule],
  templateUrl: './lista-productos.component.html',
  styleUrl: './lista-productos.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListaProductosComponent {

  constructor(){}
  productsService: ProductsService = inject(ProductsService);
  customStylesValidated = false;
  aplyForm = new FormGroup({
          filter: new FormControl(''),
          brand: new FormControl(''),
          category: new FormControl('')
        });
  Loading = true;

  productsStore: Producto[] = [];
  brandsStore: Brand[] = [];
  categoriesStore: Category[] = [];
  products: Producto[] = [];
  brands: Brand[] = [];
  categories: Category[] = [];

  async ngOnInit() {
    this.Loading = true;
    this.productsStore = await this.getProducts();
    this.brandsStore = await this.getBrands();
    this.categoriesStore = await this.getCategories();
    this.Loading = false;
  } 


  buscar(){
    const filtro = (this.aplyForm.get('filter')?.value)?.toLowerCase();
    if (!filtro) {

      this.products = this.productsStore;

    }else{

      this.products = this.productsStore.filter((producto) => {
        return (producto.name.toLowerCase().includes(filtro) ||
          producto.description.toLowerCase().includes(filtro) ||
          producto.sku.toLowerCase().includes(filtro) ||
          producto.category__name.toLowerCase().includes(filtro) ||
          producto.brand__name.toLowerCase().includes(filtro) )
      });


    }
  }

  async getProducts(){
    this.products = await this.productsService.getProducts();
    return this.products;
  }

  async getBrands(){
    this.brands = await this.productsService.getBrands();
    return this.brands;
  }

  async getCategories(){
    this.categories = await this.productsService.getCategories();
    return this.categories;
  }

  onSelectBrand(event: Event): void {

      const selectedValue = (event.target as HTMLSelectElement).value.toString();

      if(selectedValue!=='all'){
        this.products = this.products.filter((producto) => {
          return (producto.brand__name == selectedValue)
        });
      }else{
        this.products = this.products;
      }

  }

  onSelectCategory(event: Event): void {

      const selectedValue = (event.target as HTMLSelectElement).value.toString();

      if(selectedValue!=='all'){
        this.products = this.products.filter((producto) => {
          return (producto.category__name == selectedValue)
        });
      }else{
        this.products = this.products;
      }
      
  }

}
