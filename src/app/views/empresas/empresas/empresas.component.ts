import { Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { Empresa } from '../interfaces/empresa'
import { Regimen } from '../interfaces/regimen';
import { Pais } from '../../locations/interfaces/pais'
import { Estado } from '../../locations/interfaces/estado'
import { Municipio } from '../../locations/interfaces/municipio'
import { Ciudad } from '../../locations/interfaces/ciudad'
import { EmpresasService } from '../services/empresas.service'
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

@Component({
  selector: 'app-empresas',
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
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.scss'
})
export class EmpresasComponent {


  constructor(){

  }

  empresaService: EmpresasService = inject(EmpresasService);

  Loading:boolean = true;
  
  data: Empresa[] = [];

  paises: Pais[]=[];
  estados: Estado[]=[];
  municipios: Municipio[]=[];
  ciudades: Ciudad[]=[];
  regimenes: Regimen[]=[];

  storeEstados: Estado[]=[];
  storeMunicipios: Municipio[]=[];
  storeCiudades: Ciudad[]=[];
  colonias=[];

  TituloModal='Registro de empresas';
  SubTituloModal='Crear empresa';
  editEmpresa = {edit:false,id:0};
  inValidRequest = false;
  successRequest = false;
  RequestMessage ='';
  warningRequest =false;
  modalRegistro =false;
  inValidRazonSocial = false;
  inValidNombreComercial = false;
  inValidRegistroPatronal = false;
  inValidPais = false;
  inValidEstado = false;
  inValidMunicipio = false;
  inValidCiudad = false;
  inValidCp = false;
  inValidCalle = false;
  inValidNumExt = false;
  inValidRegimen = false;
  alertDelete=false



  customStylesValidated = false;


  aplyForm = new FormGroup({
    razonSocial: new FormControl(''),
    nombreComercial: new FormControl(''),
    registroPatronal: new FormControl(''),
    pais: new FormControl(''),
    estado: new FormControl(''),
    municipio: new FormControl(''),
    ciudad: new FormControl(''),
    codigoPostal: new FormControl(''),
    calle: new FormControl(''),
    numInt: new FormControl(''),
    numExt: new FormControl(''),
    regimen: new FormControl(''),
  });

  async ngOnInit(): Promise<void> {
    const data = await this.getEmpresas();
      if(data){
        this.data = data
        this.Loading = false;
      }

    const ListaPaises = await this.empresaService.getPaisesList();
    if(ListaPaises){
      this.paises =ListaPaises;
    }

    const ListaEstados = await this.empresaService.getEstadosList();
    if(ListaEstados){
      this.storeEstados =ListaEstados;
    }

    const ListaMunicipios = await this.empresaService.getMunicipiosList();
    if(ListaMunicipios){
      this.storeMunicipios =ListaMunicipios;
    }

    const ListaCiudades = await this.empresaService.getCiudadesList();
    if(ListaCiudades){
      this.storeCiudades =ListaCiudades;
    }

    const ListaRegimenes = await this.empresaService.getRegimenesList();
    if(ListaRegimenes){
      this.regimenes = ListaRegimenes;
    }
  }



  cerrarModalRegistro(){
    this.aplyForm.patchValue({
      razonSocial: '',
      nombreComercial: '',
      registroPatronal: '',
      pais: '',
      estado: '',
      municipio: '',
      ciudad: '',
      codigoPostal: '',
      calle: '',
      numInt: '',
      numExt: '',
      regimen:'',
    });
    this.modalRegistro =false;
        
  }

  mostrarModal(edit=false,id = 0){
    this.editEmpresa={edit:edit,id:id}
    const empresa = this.data.find(empresa => empresa.id===id)
    this.TituloModal='Registro de empresas';
    this.SubTituloModal='Crear empresa';
    if(this.editEmpresa.edit && empresa){
      this.TituloModal='Editar empresa';
      this.SubTituloModal='Editar empresa';
      const pais = this.paises.find(pais => pais.nombre === empresa.pais.toString());
      this.estados = this.storeEstados.filter(estado => estado.pais_id == pais?.id)
      const estado = this.estados.find(estado => estado.nombre === empresa.estado.toString());
      this.municipios = this.storeMunicipios.filter(municipio => municipio.estado_id == estado?.id)
      const municipio = this.municipios.find(municipio => municipio.nombre === empresa.municipio.toString());
      this.ciudades = this.storeCiudades.filter(ciudad => ciudad.municipio_id == municipio?.id)
      const ciudad = this.ciudades.find(ciudad => ciudad.nombre === empresa.ciudad.toString());
      const regimen = this.regimenes.find(regimen => regimen.nombre === empresa.regimen.toString());
 
      if(pais&&estado&&municipio&&ciudad&&regimen){
        this.aplyForm.patchValue({
          razonSocial: empresa.razon_social,
          nombreComercial: empresa.nombre_comercial,
          registroPatronal: empresa.registro_patronal,
          pais: pais.id.toString(),
          estado: estado.id.toString(),
          municipio: municipio.id.toString(),
          ciudad: ciudad.id.toString(),
          codigoPostal: empresa.codigo_postal,
          calle: empresa.calle,
          numInt: empresa.numero_interior,
          numExt: empresa.numero_exterior,
          regimen: regimen.id.toString(),
        });
      }
    }
    this.modalRegistro = true;
  }


  async getEmpresas(): Promise<Empresa[] | undefined>{

    const response = await this.empresaService.getEmpresasList();
    if(response){
      return response;
    }else{
      return [];
    }

  }


  async FiltrarEstados(event: Event){
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.estados = this.storeEstados.filter(estado => estado.pais_id == Number(selectedValue))
  }


  async FiltrarMunicipios(event: Event){
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.municipios = this.storeMunicipios.filter(municipio => municipio.estado_id == Number(selectedValue))
  }

  async FiltrarCiudades(event: Event){
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.ciudades = this.storeCiudades.filter(ciudad => ciudad.municipio_id == Number(selectedValue))
  }

  

  async onSubmitRegister(){
   
    this.validarInputs();


    if(this.inValidRazonSocial||this.inValidNombreComercial||this.inValidRegistroPatronal ||this.inValidPais||this.inValidEstado||this.inValidMunicipio||this.inValidCiudad||this.inValidCp||this.inValidCalle||this.inValidNumExt||this.inValidRegimen )return;
  
    this.Loading = true;
    this.aplyForm.disable();

   const pais = parseInt(this.aplyForm.value.pais??'0')
   const estado = parseInt(this.aplyForm.value.estado??'0')
   const municipio = parseInt(this.aplyForm.value.municipio??'0')
   const ciudad = parseInt(this.aplyForm.value.ciudad??'0')
   const regimen = parseInt(this.aplyForm.value.regimen??'0')

    const response = await this.empresaService.setRegister(
      this.aplyForm.value.razonSocial??'',
      this.aplyForm.value.nombreComercial??'',
      this.aplyForm.value.registroPatronal??'',
      pais,
      estado,
      municipio,
      ciudad,
      this.aplyForm.value.codigoPostal??'',
      this.aplyForm.value.calle??'',
      this.aplyForm.value.numExt??'',
      this.aplyForm.value.numInt??'',
      regimen,
      this.editEmpresa.edit,
      this.editEmpresa.id
    );
    this.cerrarModalRegistro()
  
  if(response.success){

    
  
    this.aplyForm.enable();
    this.successRequest=true;
    this.RequestMessage = response.message;  

    const empresas = await this.getEmpresas();
      if(empresas){
        this.data = empresas;
        this.Loading = false;
        
      }
  
    
  }else{

    this.Loading = response.success;
    this.aplyForm.enable();
    this.inValidRequest=true;
    this.RequestMessage = response.message??'error';  
    

  }

  setTimeout(() => {
    this.inValidRequest=false;
    this.successRequest=false;
  }, 5000);

  }


  validarInputs(){
    this.inValidRazonSocial = this.aplyForm.value.razonSocial==''?true:false;
    this.inValidNombreComercial = this.aplyForm.value.nombreComercial==''?true:false;
    this.inValidRegistroPatronal = this.aplyForm.value.registroPatronal==''?true:false;
    this.inValidPais = this.aplyForm.value.pais==''?true:false;
    this.inValidEstado = this.aplyForm.value.estado==''?true:false;
    this.inValidMunicipio = this.aplyForm.value.municipio==''?true:false;
    this.inValidCiudad = this.aplyForm.value.ciudad==''?true:false;
    this.inValidCp = this.aplyForm.value.codigoPostal==''?true:false;
    this.inValidCalle = this.aplyForm.value.calle==''?true:false;
    this.inValidNumExt = this.aplyForm.value.numExt==''?true:false;
    this.inValidRegimen = this.aplyForm.value.regimen==''?true:false;
    this.resetValidacion();
  }

  resetValidacion(){
    setTimeout(() => {
      this.inValidRazonSocial = false;
    this.inValidNombreComercial = false;
    this.inValidRegistroPatronal =false;
    this.inValidPais = false;
    this.inValidEstado = false;
    this.inValidMunicipio = false;
    this.inValidCiudad = false;
    this.inValidCp = false;
    this.inValidCalle = false;
    this.inValidNumExt = false;
    this.inValidRegimen = false;
    }, 5000);
  }


  async deleteEmpresa(){
    this.Loading = true;
    const response = await this.empresaService.setDeleteEmpresa(this.editEmpresa.id);

    if(!response){
      this.inValidRequest=true;
      this.RequestMessage = response.message??'error';  
    }else{
      this.warningRequest=true;
      this.RequestMessage = response.message; 
    }

    this.cerrarModalRegistro()
    this.alertDelete=false
    setTimeout(() => {
      this.inValidRequest=false;
      this.warningRequest=false;
      this.RequestMessage = '';  
    }, 5000);
    const empresas = await this.getEmpresas();
      if(empresas){
        this.data = empresas;
        this.Loading = false;
      }
    
  }
}
