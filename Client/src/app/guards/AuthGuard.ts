import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, take } from 'rxjs';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private accountService : AccountService, private toastr : ToastrService, private router: Router){}
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.accountService.loadedUser.pipe(
      take(1),
      map(user => {
        if (user != null) {
          return true;
        }
        this.toastr.error("You Should Login");
        this.router.navigateByUrl("login");
        return false;
      })
    );
  }
  
}