import { Component, OnInit } from '@angular/core';
import {DashboardService} from '../dashboard/dashboard.service'
import {AlertService} from '../../_services';
import { ParamsComponent } from '../dashboard/params.component';
import { User } from 'src/app/_models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isDisabled = 0;
  private values; 
  private summaries;
  private users; 
  public rowData: any;
  constructor(private _dashboardService: DashboardService, private alertService: AlertService) { }

  columnDefs = [
    { headerName: 'FirstName', field: 'firstName', width :100 },
    { headerName: 'LastName', field: 'lastName', width :100 },
    { headerName: 'UserName', field: 'userName', width :100 },    
    { headerName: 'Created Date', field: 'createdDate', width :170 },
    { headerName: 'Active', field: 'isActive', width :80},
    { headerName: 'Edit', field: 'userId', cellRendererFramework: ParamsComponent, width :80 }    
];

  ngOnInit() {    
    this.getUsers();
  }
  
  getUsers() {
    this._dashboardService.getUsers().subscribe(
      data => {
        this.users = data;  
        this.rowData = data;       
      },
      error => {        
        this.alertService.showError(error);
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
