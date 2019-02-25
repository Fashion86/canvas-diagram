import { Component, OnInit } from '@angular/core';
import {FirebaseUserModel} from '../core/datamodel/user.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isCollapsed = true;
  user: FirebaseUserModel = new FirebaseUserModel();
  constructor(private router: Router) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }
  onCollaps() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
