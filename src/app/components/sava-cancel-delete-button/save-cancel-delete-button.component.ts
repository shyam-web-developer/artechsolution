/* import { Component, OnInit, ViewChild, Output,EventEmitter,Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'save-cancel-delete-button',
  templateUrl: './save-cancel-delete-button.component.html',
  styles: ['.btn-link { font-weight: 400; color: #337ab7 !important;  border-radius: 0;}']
})

export class SaveCancelDeleteButtonComponent {  
  @Input() isReadonly : any; 
  @Output() clearItem: EventEmitter<string> = new EventEmitter<string>(); 
 
  btnResetClickEvent(event: any) {   
    this.clearItem.emit(event);
  }
} */