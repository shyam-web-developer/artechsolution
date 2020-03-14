import { Component } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent {
  currentUserName: string;
  constructor(public cmnSrv: CommonService) {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      this.currentUserName = currentUser.userName;
    }
  }
}

