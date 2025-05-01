import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonCloseDirective,
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  ThemeDirective
} from '@coreui/angular';


@Component({
  selector: 'app-modalcentrado',
  imports: [
    ButtonCloseDirective,
    ButtonDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective,
    ThemeDirective
  ],
  templateUrl: './modalcentrado.component.html',
  styleUrl: './modalcentrado.component.scss'
})
export class ModalcentradoComponent {

  @Input() text = '';
  @Input() tittle = '';
  @Input() parentFunction!: () => void; // Define un @Input para la función

  // Método para llamar a la función del padre
  callParentFunction() {
    if (this.parentFunction) {
      this.parentFunction();
    }
  }

}
