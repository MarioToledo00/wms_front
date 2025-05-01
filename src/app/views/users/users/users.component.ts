import { Component, inject, OnInit ,NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInterface } from '../interface/user-interface';
import { IconDirective } from '@coreui/icons-angular';
import { UsersserviceService } from '../services/usersservice.service';
import { FormControl, FormGroup, ReactiveFormsModule,FormsModule ,Validators} from '@angular/forms';
import { Router } from '@angular/router'; // Importa Router
import { Rol } from '../interface/rol'
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
  FormModule }from '@coreui/angular'
@Component({
  selector: 'app-users',
  imports: [ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ContainerComponent,
    AlertComponent,
    FormDirective,
    IconDirective,
    TableDirective,
    FormControlDirective,
    FormModule, 
    CommonModule,
    ButtonDirective,
    SpinnerComponent, 
    ReactiveFormsModule,
    FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  customStylesValidated = false;
  browserDefaultsValidated = true;
  tooltipValidated = false;
  usersList: UserInterface[] = [];
  roles: Rol[] = [];
  usersService: UsersserviceService = inject(UsersserviceService);
  modalRegistro: boolean = false;
  TituloModal = 'Registro de usuario';
  SubTituloModal = 'Crear cuenta';
  editUser = {edit:false,id:0};
  inValidEmail = false;
  inValidEmailAdmin = false;
  inValidEmailCorreccion =  false;
  inValidName = false;
  inValidPassword = false;
  inValidPasswordConfirm = false;
  inValidTel = false;
  inValidRol=false;
  successRequest=false;
  inValidRequest = false;
  responseMessage = '';
  warningRequest = false
  SolicitudUsuario = false;
  showModalConfirmacion = false;
  alertDelete=false

  aplyForm = new FormGroup({
        name: new FormControl(''),
        email: new FormControl(''),
        tel: new FormControl(''),
        rol: new FormControl(''),
        password: new FormControl(''),
        password_confirm: new FormControl(''),
      });

  Loading = true;

  constructor( private router:Router) {

  }


  // Esta función se ejecutará al cargar el componente
 
  async ngOnInit(): Promise<void> {

      const response = await this.getAllUsersList();
      const roles = await this.getRolesUsuarios();
      if(response && roles){
        this.usersList = response
        this.Loading = false;
        this.roles = roles;
      }
    
  }

  cerrarModalRegistro(){
    
    this.aplyForm.patchValue({
      name:'',
      email:'',
      tel:'',
      password:'',
      password_confirm:'',
      rol:'',
    });
    this.modalRegistro =false;
    this.inValidEmail = false;
    this.inValidEmailAdmin = false;
    this.inValidName = false;
    this.inValidPassword = false;
    this.inValidPasswordConfirm = false;
    this.inValidTel = false;
    this.inValidRol  = false;
    this.editUser={edit:false,id:0}
        
  }

  mostrarModal(edit=false,id = 0){
    this.editUser={edit:edit,id:id}
    const usuario = this.usersList.find(user=> user.id===id)
    this.TituloModal='Registro de usuario';
    this.SubTituloModal='Crear cuenta';
    if(this.editUser && usuario){
      this.TituloModal='Editar usuario';
      this.SubTituloModal='Editar cuenta';
      const rol = this.roles.find(rol => rol.nombre === usuario.rol.toString());
      if(rol){
        this.aplyForm.patchValue({
          name:usuario.name,
          email:usuario.email,
          tel:usuario.tel,
          rol: rol.id.toString(),
        });
      }
    }

    this.modalRegistro = true;
  }

  async getAllUsersList(): Promise <UserInterface[] | undefined> {
    const response = await this.usersService.getAllUsersList();
    if(response){
      return response;
    }else{
      return [];
    }

  }

    
    validateName(){
      this.inValidName = (this.aplyForm.value.name??'').length<1;
      if(this.inValidName){ this.resetAlerts()}
  }
  validateTel(){
    const tel = this.aplyForm.value.tel ?? '';

  // Verifica que tenga exactamente 10 caracteres y sean números.
  this.inValidTel = !(tel.length === 10 && !isNaN(Number(tel)));
  if(this.inValidTel){ this.resetAlerts()}
  }
  validatePassword(){

    const password = this.aplyForm.value.password ?? '';

    // Expresión regular para validar la contraseña:
    // - Al menos 8 caracteres
    // - Al menos una letra mayúscula
    // - Al menos un carácter especial
    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

    this.inValidPassword = !passwordPattern.test(password);
    if(this.inValidPassword){ this.resetAlerts()}
  }
  validatePasswordConfirm(){
      this.inValidPasswordConfirm = (this.aplyForm.value.password_confirm??'')!==(this.aplyForm.value.password??'');
      if(this.inValidPasswordConfirm){ this.resetAlerts()}
  }

  validarRol(){
    this.inValidRol = this.aplyForm.value.rol==''?true:false;
    if(this.inValidRol ){ this.resetAlerts()}
  }

  validateEmail(){
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.inValidEmail = !emailRegex.test(this.aplyForm.value.email??'');
    if(this.inValidEmail){ this.resetAlerts()}

  }
  
  resetAlerts(){
    setTimeout(() => {
        
      this.inValidEmail = false;
      this.inValidEmailAdmin = false;
      this.inValidName = false;
      this.inValidPassword = false;
      this.inValidPasswordConfirm = false;
      this.inValidTel = false;
      this.inValidRol  = false;
      
    }, 5000);
  }


  onSubmitRegister() {
    this.editUser?this.editarRegistro():this.guardarRegistro()
  }

  async guardarRegistro() {
    
    this.validateEmail();    
    this.validateName();
    this.validateTel();
    this.validatePassword();
    this.validatePasswordConfirm();
    this.validarRol();
  
    this.customStylesValidated = false;
 

    if(this.inValidEmail||this.inValidEmailAdmin||this.inValidName||this.inValidPassword||this.inValidPasswordConfirm||this.inValidTel||this.inValidEmailCorreccion|| this.inValidRol)return;
  
    this.Loading=true;
    this.aplyForm.disable();
    const rol_id = parseInt(this.aplyForm.value.rol??'0')
    const response = await this.usersService.setRegister(
      this.aplyForm.value.name ?? '',
      this.aplyForm.value.email ?? '',
      this.aplyForm.value.tel ?? '',
      this.aplyForm.value.password ?? '',
      this.aplyForm.value.password_confirm ?? '',
      rol_id,
    );

    this.modalRegistro = false;
  
    if(!response.success){
      this.Loading = response.success;
      this.aplyForm.enable();
      this.inValidRequest=true;
      this.responseMessage = response.message??'error';  
  
    }else{
      this.aplyForm.enable();
      this.successRequest=true;
      this.responseMessage = response.message;  
  
      const getUsers = await this.getAllUsersList();
      if(getUsers){
        this.usersList = getUsers;
        this.Loading = false;
        
      }
    }
   

    this.aplyForm.patchValue({
      name:'',
      email:'',
      tel:'',
      password:'',
      password_confirm:'',
      rol:'',
    });
    setTimeout(() => {
      this.inValidRequest=false;
      this.successRequest=false;
      this.responseMessage = ''; 
    }, 5000);
  
  }

  async editarRegistro() {
       
    this.validateName();
    this.validateTel();
    this.validarRol();
  
    this.customStylesValidated = false;
 

    if(this.inValidName||this.inValidTel|| this.inValidRol)return;
  
    this.Loading=true;
    this.aplyForm.disable();
    const rol_id = parseInt(this.aplyForm.value.rol??'0')
    const response = await this.usersService.setEditRegister(
      this.aplyForm.value.email ?? '',
      this.aplyForm.value.name ?? '',
      this.aplyForm.value.tel ?? '',
      rol_id,
    );

    this.modalRegistro = false;
  
    if(!response.success){
      this.Loading = response.success;
      this.aplyForm.enable();
      this.inValidRequest=true;
      this.responseMessage = response.message??'error';  
  
    }else{
      this.aplyForm.enable();
      this.successRequest=true;
      this.responseMessage = response.message;  
  
      const getUsers = await this.getAllUsersList();
      if(getUsers){
        this.usersList = getUsers;
        this.Loading = false;
        
      }
    }
   

    this.aplyForm.patchValue({
      name:'',
      email:'',
      tel:'',
      password:'',
      password_confirm:'',
      rol:'',
    });
    setTimeout(() => {
      this.inValidRequest=false;
      this.successRequest=false;
      this.responseMessage = '';  
    }, 5000);
  
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

  async deleteUser(){
    this.Loading = true;
    const response = await this.usersService.setDeleteUser(this.editUser.id);

    if(!response){
      this.inValidRequest=true;
      this.responseMessage = response.message??'error';  
    }else{
      this.warningRequest=true;
      this.responseMessage = response.message; 
    }

    this.cerrarModalRegistro()
    this.alertDelete=false
    setTimeout(() => {
      this.inValidRequest=false;
      this.warningRequest=false;
      this.responseMessage = '';  
    }, 5000);
    const getUsers = await this.getAllUsersList();
      if(getUsers){
        this.usersList = getUsers;
        this.Loading = false;
        
      }
    

  }

}
