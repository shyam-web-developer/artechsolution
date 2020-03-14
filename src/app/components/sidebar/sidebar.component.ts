import { Component } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { AuthService, AlertService } from '../../_services';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  constructor(public cmnSrv: CommonService,private authService: AuthService,private alertService: AlertService) {  }

  sidebarItems = [
    {link: '/dashboard', label: 'Dashboard', icon: 'dashboard'},
    {label: 'Master', icon: 'apps', subItem: [
      {link: '/master/session', label: 'Academic Session', icon: 'as'},
      {link: '/master/state', label: 'State', icon: 's'},
      {link: '/master/city', label: 'City', icon: 'c'},
      {link: '/master/department', label: 'Department', icon: 'd'},      
      {link: '/master/designation', label: 'Designation', icon: 'd'}     
    ]},
    {label: 'Student', icon: 'wc', subItem: [
      {link: '/student/stream', label: 'Stream', icon: 'c'},
      {link: '/student/class', label: 'Class', icon: 'c'},
      {link: '/student/addNewStudent', label: 'Add Student', icon: 'as'},
      {link: '/student/installment', label: 'Installment', icon: 'as'},
      {link: '/student/feeComponent', label: 'Fee Component', icon: 'as'},
      {link: '/student/feeStructure', label: 'Fee Structure', icon: 'as'}
    ]},
    {label: 'Employee', icon: 'accessibility_new', subItem: [
      {link: '/employee/addNewEmployee', label: 'Add Employee', icon: 'ae'}
    ]},
    {label: 'Inventory', icon: 'inventory', subItem: [
      {link: '/inventory/prodUnit', label: 'Unit', icon: 'u'},   
      {link: '/inventory/productType', label: 'Product Type', icon: 'pt'},     
      {link: '/inventory/productCat', label: 'Prod Category', icon: 'pc'},      
      {link: '/inventory/productSubCat', label: 'Sub Category', icon: 'ps'},      
      {link: '/inventory/product', label: 'Product', icon: 'p'},
      {link: '/inventory/prodReceive', label: 'Purchase', icon: 'p'},
      {link: '/inventory/prodSale', label: 'Sale', icon: 'p'},
    ]},
    
    /* 
    {link: '/charts', label: 'Charts', icon: 'show_chart'},
    {link: '/maps', label: 'Maps', icon: 'place'},
    {link: '/editors', label: 'Editors', icon: 'edit'},
    {link: '/calendar', label: 'Calendar', icon: 'date_range'},
    {label: 'Menu', icon: 'menu', subItem: [
      {link: 'void()', label: 'Sub Menu L1', icon: 'l1'},
      { label: 'Sub Menu L1', icon: 'l1' , subItem: [
        {link: 'void()', label: 'Sub Menu L2', icon: 'l2'},
        {link: 'void()', label: 'Sub Menu L2', icon: 'l2'},
      ]},      
    ]}, */
    
    { label: 'User Account', icon: 'person', subItem: [
      {link: '/users/user-profile/:id', label: 'Profile', icon: 'UP'},
      {link: '/users/change-password', label: 'change password', icon: 'CP'},
      {link: '/users/createUser', label: 'create user', icon: 'CP'}
    ]},  
  ];

  logout() : void {    
    this.authService.logout();
    this.alertService.showSuccess("Logout successful");
  }

}
