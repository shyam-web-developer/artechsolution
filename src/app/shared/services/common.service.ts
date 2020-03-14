import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { configConstant } from '../config/common.config';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private datePipe: DatePipe) { }
  dashboardState =  {
    navbarToggle: false,
    sidebarToggle: true,
    sidebarMiniToggle: false
  };

  sidebarToggle(): void {
    this.dashboardState.sidebarToggle = !this.dashboardState.sidebarToggle;
  }

  sidebarMiniToggle(): void {
    this.dashboardState.sidebarMiniToggle = !this.dashboardState.sidebarMiniToggle;
  }

  navbarToggle(): void {
    this.dashboardState.navbarToggle = !this.dashboardState.navbarToggle;
  }  

}
