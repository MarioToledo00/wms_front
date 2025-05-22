import { Component , Inject} from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, AlertComponent, TextColorDirective,SpinnerComponent, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../auth.service'; // Ruta del servicio
import { Router } from '@angular/router'; // Importa Router
import { set } from 'lodash-es';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [ ContainerComponent, RowComponent, ColComponent, SpinnerComponent, AlertComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle,ReactiveFormsModule]
})
export class LoginComponent {
    
  aplyForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private router: Router, private AuthService: AuthService) {}

  isLogged = false;
  Loading = false;
  messageError = '';
  requestError = false;


  async onSubmitLogin() {

    if (this.aplyForm.value.email === '' || this.aplyForm.value.password === '') {
      this.messageError = 'Por favor, completa todos los campos.';
      this.requestError = true;
      this.resetAlerts()
      return;
    }
    this.Loading= true;
    this.aplyForm.disable();
    const response = await this.AuthService.setLoggin(
      this.aplyForm.value.email ?? '',
      this.aplyForm.value.password ?? ''
    );

    
    if (response.access) {
      this.router.navigate(['/dashboard']); 
    } else {
      this.messageError=response.detail;
      this.Loading = false;
      this.requestError = true;
      this.aplyForm.enable();
    }

    this.resetAlerts()
    
  }

  

  doRegistro(): void {
    this.router.navigate(['/register']);
  }

  // Método que se llama automáticamente al cargar el componente
  ngOnInit(): void {
    
    if(this.AuthService.isLoggedIn()){
      this.router.navigate(['/dashboard']);
    }else{
      this.AuthService.checkAuth()
    }
    
  }

  resetAlerts() {

    setTimeout(() => {
      this.requestError = false;
      this.messageError = '';
    }, 4000);
  }

}
 