
import { Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import {TableDirective,
  ButtonDirective,ContainerComponent,
  AlertComponent,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  SpinnerComponent,
  FormDirective,
  FormControlDirective,
  FormModule} from '@coreui/angular'

import { FormControl, FormGroup, ReactiveFormsModule,FormsModule ,Validators} from '@angular/forms';
import { NgFor } from '@angular/common';
import { Rol } from '../interfaces/rol';
import { RolService } from '../services/rol.service';



@Component({
  selector: 'app-roles',
  imports: [ 
    ReactiveFormsModule,FormsModule ,
    TableDirective,
    IconDirective,
    FormDirective,
    FormControlDirective,
    FormModule,
    CommonModule,
    ButtonDirective,ContainerComponent,
    AlertComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    SpinnerComponent],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent {

  constructor(){}

  rolesService: RolService = inject(RolService);

  Loading:boolean = true;
  
  roles: Rol[] = [];
  
  TituloModal='Registro de rol';
  SubTituloModal='Crear rol';
  editRol = {edit:false,id:0};
  inValidRequest = false;
  successRequest = false;
  RequestMessage ='';
  warningRequest =false;
  modalRegistro =false;
  inValidRol = false;
  alertDelete=false

  customStylesValidated = false;

  aplyForm = new FormGroup({
    nombre: new FormControl('')
  });



  async ngOnInit(): Promise<void> {

    const roles = await this.getRoles();
      if(roles){
        this.roles = roles
        this.Loading = false;
      }

  }

  async getRoles(): Promise<Rol[] | undefined>{

    const response = await this.rolesService.getRolesList();
    if(response){
      return response;
    }else{
      return [];
    }

  }

  mostrarModal(edit:boolean=false,id:number = 0){
    this.editRol={edit:edit,id:id}
    const rol = this.roles.find(rol => rol.id===id)
    this.TituloModal='Registro de rol';
    this.SubTituloModal='Crear rol';
    if(this.editRol.edit && rol){
      this.TituloModal='Editar rol';
      this.SubTituloModal='Editar rol';
      
      this.aplyForm.patchValue({
        nombre:rol.nombre,
      });
      

    }else{

      this.aplyForm.patchValue({
        nombre: '',
      });

    }

    this.modalRegistro = true;
  }

  validarInputs(){
    this.inValidRol = this.aplyForm.value.nombre==''?true:false;
  }

  async onSubmitRegister(){
   
    this.validarInputs();


    if(this.inValidRol)return;
  
    this.Loading = true;
    this.aplyForm.disable();

    const response = await this.rolesService.setRegister(
      this.aplyForm.value.nombre??'',
      this.editRol.edit,
      this.editRol.id
    );
    
  
  if(response.success){

    this.successRequest=true;
    this.RequestMessage = response.message;  

    const roles = await this.getRoles();
      if(roles){
        this.roles = roles;
      }
  
  }else{
    this.inValidRequest=true;
    this.RequestMessage = response.message??'error';  
  }
  this.aplyForm.enable();
  this.modalRegistro =false;
  this.Loading = false;
  setTimeout(() => {
    this.inValidRequest=false;
    this.successRequest=false;
  }, 5000);

  }

  async deleteRol(){
    this.Loading = true;
    const response = await this.rolesService.setDeleteRol(this.editRol.id);

    if(!response){
      this.inValidRequest=true;
      this.RequestMessage = response.message??'error';  
    }else{
      this.warningRequest=true;
      this.RequestMessage = response.message; 
    }
    this.alertDelete=false
    setTimeout(() => {
      this.inValidRequest=false;
      this.warningRequest=false;
      this.RequestMessage = '';  
    }, 5000);
    const roles = await this.getRoles();
      if(roles){
        this.roles = roles;
        this.Loading = false;
      }
  }


}
