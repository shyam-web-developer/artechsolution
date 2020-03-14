import { Component, OnInit, ViewChild, Input, Output, EventEmitter,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LookupService } from '../lookup/lookup.service';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styles: ['.invalid-feedback { display : block !important}']
})

export class LookupComponent {
  @Input('lookupForm')
  public lookupForm: FormGroup;
  @Input() formAttribute: any;
  @Input() frmControlName: string;  
  @Input() submitted: boolean;
  @Input() options: any;   
  @Input() isFocus: any;
  @Input() isRequired: boolean;   
  @ViewChild('dropdown', {static: true}) firstField: ElementRef;
  @Output() changeLookup: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private lookupService: LookupService, private formBuilder: FormBuilder
  ) { }  

  ngOnInit() {
    if (this.isFocus) {
      this.firstField.nativeElement.focus();
    }
  }

  get f() { return this.lookupForm.controls[this.frmControlName]; }
  
  changeDropdown(event: any) {   
    this.changeLookup.emit(event);
  } 
}

