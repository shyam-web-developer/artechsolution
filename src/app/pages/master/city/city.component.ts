import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthService, CommonServices, LookupService } from '../../../_services';
import { State, City } from '../state/state';
import { CityService } from '../city/city.service';
import { lookupAttribute } from '../../../shared/lookup-attribute/lookup.attribute';
import { successMessage } from '../../../shared/messages/messages';
import { CustomValidator } from '../../../_validation/custom.validation';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: []
})

export class CityComponent {
  city: City = { cityId: 0, stateId: 0, cityName: '', stateName: '', countryId: 0, cityCode:'' };
  cityForm: FormGroup;
  loading = false;
  submitted = false;
  id: string;
  lookup: any;
  countryOptions: any;
  stateOptions: any;
  countryLookupAtr: any = lookupAttribute.Country;
  stateLookupAtr: any = lookupAttribute.State;  
  private cities: any;
  public rowData: any;
  public rowSelection: any;
  public gridApi: any;
  public isReadonly = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private lookupService: LookupService,
    private cityService: CityService, private authService: AuthService, private commonServices: CommonServices) {
    this.rowSelection = "single";
    this.isReadonly = this.authService.isReadonlyUser();
  }

  ngOnInit() {
    this.cityForm = this.formBuilder.group({
      cityId: [0],
      cityName: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],
      cityCode: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(10)]],      
      stateId: [{ value: this.city.stateId, disabled: this.isReadonly }],
      lookupForm: this.formBuilder.group({
        countryId: [{ value: this.city.countryId, disabled: this.isReadonly }, CustomValidator.lookupRequired],
        stateId: [{ value: this.city.stateId, disabled: this.isReadonly }, CustomValidator.lookupRequired]
      }),
      isActive: [true],
      createdBy: this.authService.loggedUserName()
    });
    this.getCountryLookup();
    this.getCities();
  }

  columnDefs = [
    { headerName: 'City', field: 'cityName', width: 210 },
    { headerName: 'City Code', field: 'cityCode', width: 145 },
    { headerName: 'State', field: 'stateName', width: 210 },
    { headerName: 'Country', field: 'countryName', width: 194, },
    {
      headerName: 'Created Date', field: 'createdDate', width: 150, cellRenderer: (data: any) => {
        return this.commonServices.setDateFormat(data);
      }
    },
    { headerName: 'Active', field: 'isActive', width: 100 }
  ];

  // convenience getter for easy access to form fields
  get f() { return this.cityForm.controls; }

  get lookupForm(): any { return this.cityForm.get('lookupForm'); }

  getCities() {
    this.cityService.getCities().subscribe(
      data => {
        this.cities = data;
        this.rowData = data;
      },
      error => {
        this.alertService.showError(error);
      }
    );
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.cityForm.invalid || this.isReadonly) {
      return;
    }

    this.loading = true;
    if (this.cityForm.value) {
      this.cityForm.value.stateId = Number(this.cityForm.value.lookupForm.stateId);
      this.cityForm.value.countryId = Number(this.cityForm.value.lookupForm.countryId);
    }
    this.cityService.saveCity(this.cityForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.showSuccess(successMessage.Saved);
          this.clearItem();
          this.getCities();
        },
        error => {
          this.alertService.showError(error);
          this.loading = false;
        });
  }

  clearItem() {
    this.loading = false;
    this.submitted = false;
    this.stateOptions = [];
    this.cityForm.patchValue(this.city);
    this.lookupForm.patchValue({ countryId: 0, stateId: 0 });
  }

  getCountryLookup() {
    this.lookup = { lookupName: lookupAttribute.Country.lookupName };
    this.lookupService.getLookup(this.lookup).subscribe(
      data => {
        this.countryOptions = data;
      }
    );
  };

  getStateLookup(countryId: Number) {
    this.lookup = { id: countryId, lookupName: lookupAttribute.State.lookupName };
    this.lookupService.getLookup(this.lookup).subscribe(
      data => {
        this.stateOptions = data;
      }
    );
  }

  changeCountry(event: any) {
    if (event && event.target.value == "0") {
      this.stateOptions = [];
      this.lookupForm.controls.stateId.patchValue(0);
    }
    else {
      this.getStateLookup(Number(event.target.value));
    }
  }

  onSelectionChanged(event: any) {
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      var selectedRow = selectedRows[0]
      this.cityForm.patchValue({ cityId: selectedRow.cityId, stateId: selectedRow.stateId, countryId: selectedRow.countryId, cityName: selectedRow.cityName, cityCode: selectedRow.cityCode, isActive: selectedRow.isActive, createdBy: this.authService.loggedUserName() })
      if (selectedRow.countryId) {
        this.getStateLookup(selectedRow.countryId);
        this.lookupForm.patchValue({ countryId: selectedRow.countryId, stateId: selectedRow.stateId });
      }
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }
}
