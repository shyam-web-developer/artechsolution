import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthService, CommonServices } from '../../../_services';
import { DepartmentService } from '../department/department.service';
import { successMessage } from '../../../shared/messages/messages';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: []
})

export class DepartmentComponent {
  deptForm: FormGroup;
  loading = false;
  submitted = false;
  private departments: any;
  public rowData: any;
  public rowSelection: any;
  public gridApi: any;
  public isReadonly = false;
  @ViewChild("department", {static: true}) firstField: ElementRef;  

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private departmentService: DepartmentService, private authService: AuthService,private commonServices: CommonServices) {
    this.rowSelection = "single";
    this.isReadonly = this.authService.isReadonlyUser();
  }

  columnDefs = [
    { headerName: 'Department', field: 'deptName', width: 290 },
    { headerName: 'Dept Code', field: 'deptCode', width: 180 },
    { headerName: 'Created Date', field: 'createdDate', width: 200, cellRenderer: (data : any) => {
      return this.commonServices.setDateFormat(data);
 } },
    { headerName: 'Active', field: 'isActive', width: 80 }
  ];


  ngOnInit() {
    this.deptForm = this.formBuilder.group({
      deptId: [0, Validators.required],
      deptName: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],
      deptCode: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(10)]],
      isActive: [true],
      createdBy: this.authService.loggedUserName()
    });
    this.firstField.nativeElement.focus();
    this.getDepartments();
  }

  get f() { return this.deptForm.controls; }

  getDepartments() {
    this.departmentService.getDepartments().subscribe(
      data => {
        this.departments = data;
        this.rowData = data;
      },
      error => {
        this.alertService.showError(error);
      }
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.deptForm.invalid || this.isReadonly) {
      return;
    }

    this.loading = true;
    this.departmentService.saveDepartment(this.deptForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.showSuccess(successMessage.Saved);                
          this.getDepartments();
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
    this.deptForm.reset();
    this.firstField.nativeElement.focus();
    this.deptForm.patchValue({ isActive : true});
  }

  onSelectionChanged(event : any) {
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      var selectedRow = selectedRows[0]
      this.deptForm.patchValue({ deptId: selectedRow.deptId, deptName: selectedRow.deptName, deptCode: selectedRow.deptCode, isActive: selectedRow.isActive, createdBy: this.authService.loggedUserName() })
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }
}
