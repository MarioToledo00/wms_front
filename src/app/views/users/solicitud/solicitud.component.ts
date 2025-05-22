import { Component, inject, OnInit } from '@angular/core';
import { UsersserviceService } from '../services/usersservice.service';
import { UserInterface } from '../interface/user-interface';
import { Rol } from '../interface/rol'
import {SolicitudResponse} from '../interface/solicitud-response';
import { DropdownComponent,
  TableDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective ,
  ButtonDirective,ContainerComponent,
  AlertComponent,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  SpinnerComponent,
  FormSelectDirective,
  ThemeDirective} from '@coreui/angular'
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-solicitud',
  imports: [DropdownComponent,
    DropdownItemDirective,AlertComponent,
    TableDirective,
    SpinnerComponent,
    DropdownMenuDirective,
    DropdownToggleDirective,
    ButtonDirective,ContainerComponent,
    ThemeDirective,ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    FormSelectDirective,
    NgFor,
    ModalHeaderComponent,],
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss'
})
export class SolicitudComponent {

  data: UserInterface[] = [];
  roles: Rol[] = [];
  usersService: UsersserviceService = inject(UsersserviceService);

  Loading = true;
  inValidRequest = false;
  inValidRequestMessage = '';
  UsuarioCreado = false;
  Usuariorechazado = false;
  solicitudId = 0;
  showModalAceptado = false;
  showModalRechazo= false;
  selectedRole = null;

 

    constructor() {
    }


    async ngOnInit(): Promise<void> {
      const response = await this.getSolUsuarios();
      const roles = await this.getRolesUsuarios();
      if(response && roles){
        this.Loading = false;
        this.data = response;
        this.roles = roles;
      }
     
    }

    onSelectChange(event: Event, solicitud_id:number): void {

      const registro = this.data.find(solicitud => solicitud.id == solicitud_id)

      const selectedValue = (event.target as HTMLSelectElement).value;

      if(registro){
        registro.rol=parseInt(selectedValue);
      }else{
        alert('Error al seleccionar rol');
      }

    }

    async getSolUsuarios(): Promise<UserInterface[] | undefined> {
      const response = await this.usersService.getSolUsersList();
      if(response){
        return response;
      }else{

        this.inValidRequest = true;
        setTimeout(() => {
          this.inValidRequest = false;
        }, 5000);
        return [];
      }
  
    }

    async getRolesUsuarios(): Promise<Rol[] | undefined> {
      const response = await this.usersService.getRolesUsuarios();
      if(response){
        return response;
      }else{

        this.inValidRequest = true;
        setTimeout(() => {
          this.inValidRequest = false;
        }, 5000);
        return [];
      }
  
    }


    async aceptarusuario(): Promise<SolicitudResponse | undefined>{

      const solicitud = this.data.find(sol => sol.id == this.solicitudId);

      console.log('solicitud',solicitud);

      if(!solicitud){
        this.inValidRequestMessage = 'No se encontró solicitud'
        this.inValidRequest = true;
        setTimeout(() => {
          
          this.inValidRequest = true;
          this.inValidRequestMessage = ''
        }, 5000);
        return
      }
      
      this.showModalRechazo= false;
      this.showModalAceptado = false;
      this.Loading = true;
      const response = await this.usersService.aceptarSolUsuario(this.solicitudId,solicitud.rol);
      if(response.success){
        this.UsuarioCreado = true;
        
      }else{
        this.inValidRequestMessage = response.message
        this.inValidRequest = true;
      }

      const actualizar = await this.getSolUsuarios();
        if(actualizar){
          this.Loading = false;
          this.data = actualizar
          
        }

      setTimeout(() => {
        this.UsuarioCreado = false;
        this.inValidRequest = false;
      }, 5000);
      return;
       
    }

    async rechazarusuario(): Promise<SolicitudResponse | undefined>{
      this.showModalRechazo= false;
      this.showModalAceptado = false;
      this.Loading = true;
      const response = await this.usersService.rechazarSolUsuario(this.solicitudId);
      if(response.success){
        this.Usuariorechazado = true;
        
      }else{
        this.inValidRequestMessage = response.message
        this.inValidRequest = true;
      }

      const actualizar = await this.getSolUsuarios();
        if(actualizar){
          this.Loading = false;
          this.data = actualizar
         
        }

      setTimeout(() => {
        this.Usuariorechazado = false;
        this.inValidRequest = false;
      }, 5000);
      return;
    }

    ModalAceptado(id: number){

      const solicitud = this.data.find(sol => sol.id==id);

      if(solicitud && solicitud.rol){

        this.solicitudId = id;
        this.showModalAceptado = true;

      }else{
        this.inValidRequest = true;
        this.inValidRequestMessage = 'Selecione Rol para continuar';
        setTimeout(() => {
          this.inValidRequest = false;
          this.inValidRequestMessage = '';
        }, 5000);
      }

    }

    ModalRechazo(id: number){
      this.solicitudId = id;
      
      this.showModalRechazo= true;
    }


    cerrarModal(){
      this.showModalRechazo= false;
      this.showModalAceptado = false;
    }
}
