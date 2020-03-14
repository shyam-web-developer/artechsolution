import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthService, CommonServices } from '../../../_services';
import { StreamService } from '../stream/stream.service';
import { successMessage } from '../../../shared/messages/messages';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: []
})

export class StreamComponent {  
  streamForm: FormGroup;
  loading = false;
  submitted = false;  
  @ViewChild("streamName", {static: true}) firstField: ElementRef;  
  public rowData: any;
  public rowSelection: any;
  public gridApi: any;
  public isReadonly = false;

  constructor(
    private formBuilder: FormBuilder,     
    private alertService: AlertService,
    private streamService: StreamService, private authService: AuthService, private commonServices: CommonServices) {
      this.rowSelection = "single";
     }

    columnDefs = [
      { headerName: 'Stream Name', field: 'streamName', width: 210 },
      { headerName: 'Stream Code', field: 'streamCode', width: 145 },     
      {
        headerName: 'Created Date', field: 'createdDate', width: 150, cellRenderer: (data: any) => {
          return this.commonServices.setDateFormat(data);
        }
      },
      { headerName: 'Active', field: 'isActive', width: 100 }
    ];
  ngOnInit() {   
    this.streamForm = this.formBuilder.group({ 
      streamId: [0],
      streamName: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],
      streamCode: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(10)]],
      isActive: [true],
      createdBy: this.authService.loggedUserName(),
      createdDate: new Date(),
    });   
    this.firstField.nativeElement.focus(); 
    this.getStreams();
  }  

  get f() { return this.streamForm.controls; }  

  getStreams() {
    this.streamService.getStream().subscribe(
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
    if (this.streamForm.invalid || this.isReadonly) {
      return;
    }

    this.loading = true;
    this.streamService.saveStream(this.streamForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.showSuccess(successMessage.Saved);
          this.clearItem();
          this.getStreams();
        },
        error => {
          this.alertService.showError(error);
          this.loading = false;
        });
  }

  onSelectionChanged(event: any) {
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      let selectedRow = selectedRows[0]
      this.streamForm.patchValue({ streamId: selectedRow.streamId, streamName: selectedRow.streamName, streamCode: selectedRow.streamCode, isActive: selectedRow.isActive, createdBy: this.authService.loggedUserName() });    
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }
  
  clearItem() {
    this.loading = false;
    this.submitted = false;
    this.streamForm.reset();
    this.streamForm.patchValue({ streamId: 0});
    this.firstField.nativeElement.focus();
  } 
}
