import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthService, CommonServices, LookupService } from '../../../_services';
import { State } from '../state/state';
import { StateService } from '../state/state.service';
import { lookupAttribute } from '../../../shared/lookup-attribute/lookup.attribute';
import { successMessage } from '../../../shared/messages/messages';
import { CustomValidator } from '../../../_validation/custom.validation';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: []
})

export class StateComponent {
  state: State = { stateId: 0, stateName: '', countryId: 0 };
  stateForm: FormGroup;
  loading = false;
  submitted = false;
  isReadonly = false;  
  lookup: any;
  countryOptions : any;  
  public rowData: any; 
  public gridApi: any;
  public rowSelection: any;
  @ViewChild("stateName", {static: true}) firstField: ElementRef;
  countryLookupAtr: any = lookupAttribute.Country;
  constructor(
    private formBuilder: FormBuilder,    
    private stateService: StateService,
    private alertService: AlertService,  
    private lookupService: LookupService,private authService: AuthService,private commonServices: CommonServices) {
      this.rowSelection = "single";
     }

    columnDefs = [
      { headerName: 'State Name', field: 'stateName', width: 300 },
      { headerName: 'State Code', field: 'stateCode', width: 170 },
      { headerName: 'Country', field: 'countryName', width: 180 },
      { headerName: 'Active', field: 'isActive', width: 90 }
    ];

  ngOnInit() {    
    this.state.countryId = 99
    this.stateForm = this.formBuilder.group({
      stateId : [0],
      countryId : [{ value: this.state.countryId, disabled: this.isReadonly }],
      stateName: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],   
      stateCode : [{ value: '', disabled: this.isReadonly }],
      isActive : [{ value: true, disabled: this.isReadonly }],
      createdBy: this.authService.loggedUserName(),
      lookupForm: this.formBuilder.group({
        countryId: [{ value: this.state.countryId, disabled: this.isReadonly }, CustomValidator.lookupRequired],
      })
    });

    this.getCountryLookup();
    this.getStates();
    this.firstField.nativeElement.focus();
  }

  // convenience getter for easy access to form fields
  get f() { return this.stateForm.controls; }
  get lookupForm(): any { return this.stateForm.get('lookupForm'); }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.stateForm.invalid || this.isReadonly) {
      return;
    }
    if (!this.isReadonly) {
      this.loading = true;
      this.stateService.saveState(this.stateForm.value)
        .pipe(first())
        .subscribe(
          data => {
            this.alertService.showSuccess(successMessage.Saved);
            this.loading = false;
            this.submitted = false;           
            this.getStates();
            this.stateForm.patchValue({ isActive : true, stateName: ""});
          },
          error => {
            this.alertService.showError(error);
            this.loading = false;
          });
    }
  }
  
  clearItem() {
    this.loading = false;
    this.submitted = false;
    this.stateForm.patchValue({ stateId: 0, stateName: '', stateCode: '', countryId: 0 });
    this.lookupForm.controls.countryId.patchValue(99);
  }

  getCountryLookup() {
    this.lookup = { lookupName: lookupAttribute.Country.lookupName };
    this.lookupService.getLookup(this.lookup).subscribe(
      data => {
        this.countryOptions =data;       
      }
    );
  }

  getStates() {
    this.stateService.getStates().subscribe(
      data => {       
        this.rowData = data;
      },
      error => {
        this.alertService.showError(error);
      },
      () => console.log('done loading values')
    );
  }

  onSelectionChanged(event : any) {
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      var selectedRow = selectedRows[0]
      this.stateForm.patchValue({ stateId: selectedRow.stateId, stateName: selectedRow.stateName, stateCode: selectedRow.stateCode, isActive: selectedRow.isActive, countryId : selectedRow.countryId, createdBy: this.authService.loggedUserName() })
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

}
