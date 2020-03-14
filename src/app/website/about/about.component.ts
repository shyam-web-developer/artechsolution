import { Component, OnInit } from '@angular/core';
import { AboutService } from './about.service';
import { AlertService } from '../../_services/alert.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html'
  //styleUrls: ['./about.component.css']
})
export class AboutComponent {
  title = 'About';
  isDisabled = 0;
  private values; private summaries;
  constructor(private _aboutService: AboutService, private alertService: AlertService) { }

  ngOnInit() {
   // this.getValues();
  }

  getValues() {
    this._aboutService.getValues().subscribe(
      data => {
        this.values = data;
        this.summaries = data;
      },
      error => {
        let err = error.error.error_description || error.error.message;
        this.alertService.showError(err);
      },
      () => console.log('done loading values')
    );
  }
  changeDropdown(val: any) {
    if (val == "0")
      this.values = this.summaries;
    else
      this.values = this.summaries.filter((item) => item.id == val);
  }
}
