import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { LogoutmodalService } from './logoutmodal.service';
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
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './default-layout.component.html',
    styleUrls: ['./default-layout.component.scss'],
    imports: [
      ModalBodyComponent,
      ModalComponent,
      ModalFooterComponent,
      ModalHeaderComponent,
        SidebarComponent,
        SidebarHeaderComponent,
        SidebarBrandComponent,
        RouterLink,
        NgScrollbar,
        SidebarNavComponent,
        SidebarFooterComponent,
        SidebarToggleDirective,
        SidebarTogglerDirective,
        DefaultHeaderComponent,
        ShadowOnScrollDirective,
        ContainerComponent,
        RouterOutlet,
        DefaultFooterComponent
    ]
})
export class DefaultLayoutComponent {
  public navItems = navItems;
  showLogoutModal = true;

  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }

  constructor(private authService: AuthService, private router: Router,private LogoutmodalService: LogoutmodalService) {}
  showModal: boolean = false;


  ngOnInit(): void {
    // Escuchar cambios en la visibilidad del modal
    this.LogoutmodalService.modalVisibility$.subscribe(
      (visibility) => (this.showModal = visibility)
    );
  }

  cancelLogout(): void {
    this.LogoutmodalService.hideModal();
  }

  confirmLogout(): void {
    this.LogoutmodalService.hideModal();
    this.authService.logout();
    // Aquí puedes agregar la lógica para cerrar sesión
  }
}
