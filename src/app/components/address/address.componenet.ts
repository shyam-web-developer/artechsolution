import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AlertService, LookupService } from '../../_services';
import { lookupAttribute } from '../../shared/lookup-attribute/lookup.attribute';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
})
export class AddressComponent {
  @Input('addressForm')
  public addressForm: FormGroup;
  @Input() submitted = false;
  lookup: any;
  countryOptions: any;
  stateOptions: any;
  cityOptions: any;
  countryLookupAtr: any = lookupAttribute.Country;
  stateLookupAtr: any = lookupAttribute.State;
  constructor(   
    private alertService: AlertService,
    private lookupService: LookupService) { }

  ngOnInit() {
    this.stateOptions = [];
    this.cityOptions = [];
    this.getCountryLookup();    
  }
  

  get f() { return this.addressForm.controls; }

  getCountryLookup() {
    this.lookup = { lookupName: lookupAttribute.Country.lookupName };
    this.lookupService.getLookup(this.lookup).subscribe(
      data => {
        this.countryOptions = data;
        if (this.f.countryId.value != '0') {
          let event = { target: { value: this.f.countryId.value } }
          this.changeCountry(event);
        }
      },
      error => {                   
          this.alertService.showError(error); 
      }); 
  };

  getStateLookup(countryId: Number) {
    this.lookup = { id: countryId, lookupName: lookupAttribute.State.lookupName };
    this.lookupService.getLookup(this.lookup).subscribe(
      data => {
        this.stateOptions = data;
      },
      error => {                   
          this.alertService.showError(error); 
      }); 
  }
  
  getCityLookup(stateId: Number) {
    this.lookup = { id: stateId, lookupName: lookupAttribute.City.lookupName };
    this.lookupService.getLookup(this.lookup).subscribe(
      data => {
        this.cityOptions = data;
      },
      error => {                   
          this.alertService.showError(error); 
      }); 
  }

  changeCountry(event: any) {
    this.stateOptions = [];
    this.cityOptions = [];
    this.addressForm.patchValue({ stateId: '0', cityId: '0' });
    if (event && event.target.value != '0') {
      this.getStateLookup(Number(event.target.value));
    }
  }

  changeState(event: any) {
    this.cityOptions = [];
    this.addressForm.patchValue({ cityId: '0' });
    if (event && event.target.value != '0') {
      this.getCityLookup(Number(event.target.value));
    }
  }
}
