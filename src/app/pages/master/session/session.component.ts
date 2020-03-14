import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthService, CommonServices } from '../../../_services';
import { SessionService } from '../session/session.service';
import { successMessage } from '../../../shared/messages/messages';
import { FlatpickrOptions } from 'ng2-flatpickr';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styles: ['.session-span { padding-left: 10px; padding-top: 3px; display: block;width: 100%; height: 28px;font-size: 14px;line-height: 1.42857143; color: #555; background-color: #fff; background-image: none; border: 1px solid #ccc;border-radius: 4px;box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;}']
})

export class SessionComponent {  
  @ViewChild('startPicker', {static: true}) pickerStart:any;
  

  sessionForm: FormGroup;
  loading = false;
  submitted = false;  
  public rowData: any;
  public rowSelection: any;
  public gridApi: any;
  public isReadonly = false;
  private selectedFromDate : any;
  @ViewChild("session", {static: true}) firstField: ElementRef;

  public fromDateOptions: FlatpickrOptions = {
    //defaultDate : new Date(),
    //enableTime: true,  
    dateFormat: 'm-d-Y',
    onChange: function (parent) {
      return function (selectedDates, dateStr, instance) {
        var fromDate = new Date(dateStr);
        parent.sessionForm.controls['fromDate'].setValue(fromDate);
      };
    }(this)
  };


public toDateOptions: FlatpickrOptions = { 
  //defaultDate : new Date(),
  dateFormat: 'm-d-Y',
  onChange: function (parent) {  
    return function (selectedDates, dateStr, instance) { 
      var toDate = new Date(dateStr);      
      parent.sessionForm.controls['toDate'].setValue(toDate);
      if(parent.sessionForm.controls['fromDate'].value) {
        var sessionName = parent.sessionForm.controls['fromDate'].value.getFullYear() +' '+ toDate.getFullYear();
        parent.sessionForm.controls['sessionName'].setValue(sessionName);
      } 
    };  
}(this) 
  
};  

  constructor(
    private formBuilder: FormBuilder,     
    private alertService: AlertService,
    private sessionService: SessionService,private authService: AuthService,private commonServices: CommonServices) {
      this.rowSelection = "single";      
     }

    columnDefs = [
      { headerName: 'Session', field: 'sessionName', width: 212 },    
      { headerName: 'From Date', field: 'fromDate', width: 200 , cellRenderer: (data : any) => {
        return this.commonServices.setDateFormat(data);  } },
      { headerName: 'To Date', field: 'toDate', width: 200 , cellRenderer: (data : any) => {
        return this.commonServices.setDateFormat(data);  } },
      { headerName: 'Created Date', field: 'createdDate', width: 200, cellRenderer: (data : any) => {
        return this.commonServices.setDateFormat(data);  } },
      { headerName: 'Active', field: 'isActive', width: 200 }
    ];

  ngOnInit() {   
    this.sessionForm = this.formBuilder.group({           
      sessionId: [0, Validators.required],  
      sessionName: [{ value: '', disabled: this.isReadonly }, ],    
      fromDate : ['', Validators.required],
      toDate : ['', Validators.required],
      isActive : [true], 
      createdBy: this.authService.loggedUserName()
    });   
    //this.firstField.nativeElement.focus(); 
    this.getSessions();
  }

  get f() { return this.sessionForm.controls; }
  
  
  getSessions() {
    this.sessionService.getSessions().subscribe(
      data => {       
        this.rowData = data;
      },
      error => {
        this.alertService.showError(error);
      }      
    );
  }

  onSubmit() {
    this.submitted = true;   
    if (this.sessionForm.invalid) {
      return;
    }

    if(this.sessionForm.value.fromDate > this.sessionForm.value.toDate){
      this.alertService.showError('Start Date should less than End Date');
          this.loading = false;
          return;
    } 

    this.loading = true;   

    this.sessionService.saveSession(this.sessionForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.showSuccess(successMessage.Saved);          
          this.getSessions();
          this.clearItem();          
        },
        error => {
          this.alertService.showError(error);
          this.loading = false;
        });
  }
  
  clearItem() {  
    this.submitted = false;  
    this.loading = false;        
    this.sessionForm.patchValue({ sessionId: 0, sessionName: '', sessionCode: '', fromDate : '', toDate : '', isActive: true })
    
  }

  onDateChanged (){
    console.log('changed');
  }

  onSelectionChanged(event : any) {
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      var selectedRow = selectedRows[0]
      this.sessionForm.patchValue({ sessionId: selectedRow.sessionId, sessionName: selectedRow.sessionName, sessionCode: selectedRow.sessionCode, fromDate : selectedRow.fromDate, toDate : selectedRow.toDate, isActive: selectedRow.isActive })
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }
}
