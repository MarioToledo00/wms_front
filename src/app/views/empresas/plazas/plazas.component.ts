import { Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { Empresa } from '../interfaces/empresa'
import { Plaza } from '../interfaces/plaza'
import { PlazasService } from '../services/plazas.service';
import {TableDirective,
  ButtonDirective,ContainerComponent,
  AlertComponent,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  SpinnerComponent,
  FormSelectDirective,
  FormDirective,
  FormControlDirective,
  FormModule} from '@coreui/angular'

import { FormControl, FormGroup, ReactiveFormsModule,FormsModule ,Validators} from '@angular/forms';
import { NgFor } from '@angular/common';
import { EmpresasService } from '../services/empresas.service';

@Component({
  selector: 'app-plazas',
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
    SpinnerComponent,
    FormSelectDirective],
  templateUrl: './plazas.component.html',
  styleUrl: './plazas.component.scss'
})
export class PlazasComponent {

  constructor(){}

  empresaService: EmpresasService = inject(EmpresasService);
  plazaService: PlazasService = inject(PlazasService);

  Loading:boolean = true;
  
  plazas: Plaza[] = [];
  
  empresas: Empresa[] = [];
  
  TituloModal='Registro de plaza';
  SubTituloModal='Crear plaza';
  editPlaza = {edit:false,id:0};
  inValidRequest = false;
  successRequest = false;
  RequestMessage ='';
  warningRequest =false;
  modalRegistro =false;
  inValidPlaza = false;
  inValidEmpresa = false;
  alertDelete=false

  customStylesValidated = false;

  aplyForm = new FormGroup({
    nombrePlaza: new FormControl(''),
    empresa_id: new FormControl(''),
  });



  async ngOnInit(): Promise<void> {

    const data = await this.getPlazas();
      if(data){
        this.plazas = data
        this.Loading = false;
      }

    const empresas = await this.getEmpresas();
      if(empresas){
        this.empresas = empresas
        this.Loading = false;
      }
   
  }

  async getEmpresas(): Promise<Empresa[] | undefined>{

    const response = await this.empresaService.getEmpresasList();
    if(response){
      return response;
    }else{
      return [];
    }

  }

  async getPlazas(): Promise<Plaza[] | undefined>{

    const response = await this.plazaService.getPlazaList();
    if(response){
      return response;
    }else{
      return [];
    }

  }

  mostrarModal(edit:boolean=false,id:number = 0){
    this.editPlaza={edit:edit,id:id}
    const plaza = this.plazas.find(plaza => plaza.id===id)
    this.TituloModal='Registro de plazas';
    this.SubTituloModal='Crear plaza';
    if(this.editPlaza.edit && plaza){
      this.TituloModal='Editar plaza';
      this.SubTituloModal='Editar plaza';
      const empresa = this.empresas.find(empresa => empresa.razon_social === plaza.empresa.toString());
     
      if(empresa){
        this.aplyForm.patchValue({
          nombrePlaza:plaza.nombre,
          empresa_id:empresa.id.toString()
        });
      }

    }else{

      this.aplyForm.patchValue({
        nombrePlaza: '',
        empresa_id: '',
      });

    }

    this.modalRegistro = true;
  }

  validarInputs(){
    this.inValidPlaza = this.aplyForm.value.nombrePlaza==''?true:false;
    this.inValidEmpresa = this.aplyForm.value.empresa_id==''?true:false;
  }

  async onSubmitRegister(){
   
    this.validarInputs();


    if(this.inValidPlaza||this.inValidEmpresa )return;
  
    this.Loading = true;
    this.aplyForm.disable();

    const response = await this.plazaService.setRegister(
      this.aplyForm.value.nombrePlaza??'',
      parseInt(this.aplyForm.value.empresa_id??'0'),
      this.editPlaza.edit,
      this.editPlaza.id
    );
    
  
  if(response.success){

    this.successRequest=true;
    this.RequestMessage = response.message;  

    const plazas = await this.getPlazas();
      if(plazas){
        this.plazas = plazas;
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

  async deletePlaza(){
    this.Loading = true;
    const response = await this.plazaService.setDeletePlaza(this.editPlaza.id);

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
    const plazas = await this.getPlazas();
      if(plazas){
        this.plazas = plazas;
        this.Loading = false;
      }
  }


}
