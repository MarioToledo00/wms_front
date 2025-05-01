import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutmodalService {

  private modalVisibilitySubject = new BehaviorSubject<boolean>(false);
  modalVisibility$ = this.modalVisibilitySubject.asObservable();

  showModal(): void {
    this.modalVisibilitySubject.next(true);
  }

  hideModal(): void {
    this.modalVisibilitySubject.next(false);
  }
}
