import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { 
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  ContainerComponent, 
  AlertComponent,
  SpinnerComponent, 
  TooltipDirective,
  RowComponent, 
  ColComponent, 
  FormFeedbackComponent,
  TextColorDirective, 
  CardComponent, 
  CardBodyComponent, 
  FormDirective, 
  InputGroupComponent, 
  InputGroupTextDirective, 
  FormControlDirective, 
  ButtonDirective, 
  FormModule } from '@coreui/angular';
import { FormControl, FormGroup, ReactiveFormsModule,FormsModule ,Validators} from '@angular/forms';
import { AuthService } from '../../../auth.service'; // Ruta del servicio
import { Router } from '@angular/router'; // Importa Router
import { DocsExampleComponent }from  '../../../../components/docs-example/docs-example.component'
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    imports: [ContainerComponent,ModalBodyComponent,ModalComponent,ModalFooterComponent,ModalHeaderComponent,SpinnerComponent,AlertComponent, RowComponent,ReactiveFormsModule,TooltipDirective,FormFeedbackComponent,FormsModule, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective,RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, ReactiveFormsModule, FormDirective, FormControlDirective, InputGroupComponent, InputGroupTextDirective, ButtonDirective]
})
export class RegisterComponent {

  customStylesValidated = false;
  browserDefaultsValidated = true;
  tooltipValidated = false;

  inValidEmail = false;
  inValidEmailAdmin = false;
  inValidEmailCorreccion =  false;
  inValidName = false;
  inValidPassword = false;
  inValidPasswordConfirm = false;
  inValidTel = false;
  Loading = false;
  inValidRequest = false;
  responseMessage = '';
  SolicitudUsuario = false;
  showModalConfirmacion = false;

  aplyForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      tel: new FormControl(''),
      emailAdmin: new FormControl(''),
      emailCorreccion: new FormControl(''),
      password: new FormControl(''),
      password_confirm: new FormControl(''),
      token1: new FormControl(''),
      token2: new FormControl(''),
    });
    
  constructor(private AuthService:AuthService, private router:Router) { }

  
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

  validateEmail(){
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.inValidEmail = !emailRegex.test(this.aplyForm.value.email??'');
    if(this.inValidEmail){ this.resetAlerts()}else{
      this.aplyForm.patchValue({
        emailCorreccion: this.aplyForm.value.email, // Cambiar el valor del campo
      });
    }
  }
  validateEmailAdmin(){
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.inValidEmailAdmin = !emailRegex.test(this.aplyForm.value.emailAdmin??'');
    if(this.inValidEmailAdmin){ this.resetAlerts()}
  }
  validateEmailCorrecion(){
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.inValidEmailCorreccion = !emailRegex.test(this.aplyForm.value.emailCorreccion??'');
    if(this.inValidEmailCorreccion){ this.resetAlerts()}else{
      this.aplyForm.patchValue({
        email: this.aplyForm.value.emailCorreccion, // Cambiar el valor del campo
      });
    }
  }

  resetAlerts(){
    setTimeout(() => {
        
      this.inValidEmail = false;
      this.inValidEmailAdmin = false;
      this.inValidName = false;
      this.inValidPassword = false;
      this.inValidPasswordConfirm = false;
      this.inValidTel = false;
      
    }, 5000);
  }

  async onSubmitRegister() {

      this.validateEmail();
      this.validateEmailAdmin();      
      this.validateName();
      this.validateTel();
      this.validatePassword();
      this.validatePasswordConfirm();



    
    this.customStylesValidated = false;

    if(this.inValidEmail||this.inValidEmailAdmin||this.inValidName||this.inValidPassword||this.inValidPasswordConfirm||this.inValidTel||this.inValidEmailCorreccion)return;
    
    this.Loading=true;
    this.aplyForm.disable();
    const response = await this.AuthService.setRegister(
      this.aplyForm.value.name ?? '',
      this.aplyForm.value.email ?? '',
      this.aplyForm.value.tel ?? '',
      this.aplyForm.value.password ?? '',
      this.aplyForm.value.password_confirm ?? '',
      this.aplyForm.value.emailAdmin ?? ''
    );
    
    if(!response.success || response.success==false){
      this.Loading = response.success;
      this.aplyForm.enable();
      this.inValidRequest=true;
      this.responseMessage = response.message;  
      setTimeout(() => {
        this.inValidRequest=false;
      }, 5000);
    }else{

      this.showModalConfirmacion = true;
      this.Loading = false;
      this.aplyForm.enable();

    }

    
  }

  cancelSolicitudUser(): void {
    this.showModalConfirmacion = false; // Actualiza el estado según el evento
  }

  async confirmarCodigo(){
    this.Loading=true;
    this.aplyForm.disable();

    const response = await this.AuthService.setCodigo(
      this.aplyForm.value.email ?? '',
      this.aplyForm.value.token1 ?? '',
      this.aplyForm.value.token2 ?? '',
    );
    
    if(!response.success){
      this.Loading = response.success;
      this.aplyForm.enable();
      this.inValidRequest=true;
      this.responseMessage = response.message;
    }else{

      this.SolicitudUsuario = true;
      this.inValidRequest=false;
      this.aplyForm.reset();
      this.showModalConfirmacion = false;
      this.aplyForm.enable();
      this.Loading = false;
    }

  }

}
