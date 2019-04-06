import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, Router} from "@angular/router";
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from '../core/services/user.service';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    public afAuth: AngularFireAuth,
    public userService: UserService,
    private router: Router
  ) {}

  canActivate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem('user')) {
        return resolve(true);
      } else {
        this.router.navigate(['/login']);
        return resolve(false);
      }
      // this.userService.getCurrentUser()
      // .then(user => {
      //   this.router.navigate(['/user']);
      //   return resolve(false);
      // }, err => {
      //   return resolve(true);
      // });
    });
  }
}
