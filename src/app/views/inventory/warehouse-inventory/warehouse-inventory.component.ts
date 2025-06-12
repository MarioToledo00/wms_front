import { Component,CUSTOM_ELEMENTS_SCHEMA, inject, OnInit ,NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseCountService } from '../services/warehouse-count.service';
import { CountClosed } from '../interfaces/count-closed';
import { CountOpen } from '../interfaces/count-open';
import { WarehouseEnable } from '../interfaces/warehouse-enable';
import { IconDirective } from '@coreui/icons-angular';
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
  FormModule,BadgeComponent,TooltipDirective }from '@coreui/angular'
import { FormControl, FormGroup, ReactiveFormsModule,FormsModule ,Validators} from '@angular/forms';


@Component({
  selector: 'app-warehouse-inventory',
    imports: [ModalBodyComponent,
      ModalComponent,
      ModalFooterComponent,
      ModalHeaderComponent,
      ContainerComponent,
      AlertComponent,
      FormDirective,
      IconDirective,
      FormModule, 
      CommonModule,
      ButtonDirective,
      ReactiveFormsModule,
      FormsModule,TooltipDirective],
  templateUrl: './warehouse-inventory.component.html',
  styleUrl: './warehouse-inventory.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WarehouseInventoryComponent {

  constructor(){}

  private warehouseCountService = inject(WarehouseCountService);

  count_closed:CountClosed[] = [] 
  count_open:CountOpen[] = []

  closed: CountClosed[] = []
  open: CountOpen[] = []
  WarehousesEnables: WarehouseEnable[] = []
  invalidwarehouse:boolean = false

  successRequest: boolean = false;
  warningRequest: boolean = false;
  inValidRequest: boolean = false;
  RequestMessage: string = '';

  colors: any = [
    "gray-900",
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "danger"
  ]


  creating_count: boolean = false;
  customStylesValidated = false;
  createCountForm = new FormGroup({
    countType: new FormControl('1', [Validators.required]),
    warehouse: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required])
  });

  async ngOnInit() {
    this.getCountClosed();
    this.getCountOpen();
    this.getAllWarehousesEnabled();

    
    
  }

  openCreateInventoryCount() {
    this.creating_count = true;
  }

  cancelCreateCount(){
    this.creating_count = false;
    this.resetForm();
  }

  createCount(){

    this.ValidForm()

    if(this.invalidwarehouse){
        this.resetAlerts();
        return;
    }
 

    const warehouse = this.WarehousesEnables.find((w:any) => w.id === parseInt(this.createCountForm.value.warehouse||'0'));
    
    if (!warehouse) {
      this.inValidRequest = true;
      this.RequestMessage = 'Almacén no encontrado.';
      this.resetAlerts();
      return;
    }

    const count_open:CountOpen={
      name: warehouse.warehouses__name,
      address: warehouse.address,
      id: warehouse.id,
      type: this.createCountForm.value.type??'Completo',
      warehouse: parseInt(this.createCountForm.value.warehouse??'0'),
      countType: parseInt(this.createCountForm.value.countType??'1'),
      date: '',
      progress : 0,
      status: 'Open',
      info: ``
    }

    const createdCount = this.warehouseCountService.createCount(count_open);

    console.log('createdCount',createdCount);
    return

    // if(!createdCount.success){
    //   this.inValidRequest = true;
    //   this.RequestMessage = 'Error al crear el conteo. Por favor, intente nuevamente.';
    // }else{
    //   this.successRequest = true;
    //   this.RequestMessage = 'Conteo creado exitosamente.';
    //   this.getCountClosed();
    //   this.getCountOpen();
    //   this.getAllWarehousesEnabled()
    // }
    
    this.creating_count = false;
    this.resetForm();
    
    this.resetAlerts();
  }

  onSubmitRegister(){
  
  }

  openCount(id: number) {
    // Logic to open a count by its ID
    console.log(`Opening count with ID: ${id}`);
  }

  ValidForm(){

    this.invalidwarehouse = this.createCountForm.value.warehouse === '' || this.createCountForm.value.type=== '' || this.createCountForm.value.countType === '';

    if(this.invalidwarehouse){
      this.inValidRequest = true;
      this.RequestMessage = 'Por favor, complete todos los campos requeridos.';
    }

  }

  resetAlerts() {
    setTimeout(() => {
      this.invalidwarehouse = false;
      this.successRequest = false;
      this.warningRequest = false;
      this.inValidRequest = false;
      this.RequestMessage = '';
    }, 4000);
  }

  resetForm(){
    this.createCountForm.patchValue({
      countType: '1',
      warehouse: '',
      type: ''
    });
  }

  async getCountClosed() {
    const response = await this.warehouseCountService.getAllClosed();
    this.count_closed = response??[] ;
    this.closed = response??[] ;
  }

  async getCountOpen(){
      const response = await this.warehouseCountService.getAllOpen();
      this.count_open = response??[] ;
      this.open = response??[] ;
  }

  async getAllWarehousesEnabled(){
    const response = await this.warehouseCountService.getAllWarehousesEnabled();
    this.WarehousesEnables = response ?? [];
  }

}
