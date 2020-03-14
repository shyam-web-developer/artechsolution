import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthService, CommonServices } from '../../../_services';
import { DesignationService } from '../designation/designation.service';
import { successMessage } from '../../../shared/messages/messages';
import { EditDeleteButtonComponent } from 'src/app/components/edit-delete-button';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: []
})

export class DesignationComponent {  
  desigForm: FormGroup;
  loading = false;
  submitted = false;  
  private designations: any;
  public rowData: any;
  public rowSelection: any;
  public gridApi: any;
  public isReadonly : boolean ;  
  @ViewChild("designation", {static: true}) firstField: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private designationService: DesignationService, private authService: AuthService, private commonServices: CommonServices) {
    this.rowSelection = "single";
    this.isReadonly = this.authService.isReadonlyUser();
  }

    columnDefs = [
      { headerName: 'Designation', field: 'degName'},
      { headerName: 'Deg Code', field: 'degCode' },
      { headerName: 'Created Date', field: 'createdDate', cellRenderer: (data : any) => {
        return this.commonServices.setDateFormat(data);  } },
      { headerName: 'Active', field: 'isActive' },
      {
        headerName: "Action",
        cellRendererFramework: EditDeleteButtonComponent,
        field: "degId"
      }
    ];

  ngOnInit() {       
    this.desigForm = this.formBuilder.group({           
      degId: [0, Validators.required],  
      degName: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],
      degCode: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(10)]],      
      isActive : [true], 
      createdBy: this.authService.loggedUserName()      
    });   
    this.firstField.nativeElement.focus(); 
    this.getDesignations();
  }

  get f() { return this.desigForm.controls; }

  getDesignations() {
    this.designationService.getDesignations().subscribe(
      data => {
        this.designations = data;
        this.rowData = data;
      },
      error => {
        this.alertService.showError(error);
      }      
    );
  }

  onSubmit() {
    this.submitted = true;   
    if (this.desigForm.invalid || this.isReadonly) {
      return;
    }

    this.loading = true;
    this.designationService.saveDesignation(this.desigForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.showSuccess(successMessage.Saved); 
          this.getDesignations();
          this.clearItem();
        },
        error => {
          this.alertService.showError(error);
          this.loading = false;
        });
  }
  
  clearItem() {
    this.loading = false;
    this.submitted = false;
    this.desigForm.reset();
    this.desigForm.patchValue({ isActive : true});
    this.firstField.nativeElement.focus();   
  }

  onSelectionChanged(event : any) {
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      var selectedRow = selectedRows[0]
      this.desigForm.patchValue({ degId: selectedRow.degId, degName: selectedRow.degName, degCode: selectedRow.degCode, isActive: selectedRow.isActive, createdBy: this.authService.loggedUserName() })
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }
}
