import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, tap} from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { Profile } from '../models/profile';
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http : HttpClient) { }

  private baseUrl = environment.apiBaseUrl;

  loadedUser = new BehaviorSubject<User>(null);

  login(model : any)
  {
    return this.http.post<User>(this.baseUrl + "account/login", model).pipe(
      tap(
        res => {
          this.setCurrentUser(res);
        },
      )
    );
  }


  autoLogin()
  {
    const user = localStorage.getItem('user');

    if (user) {
      this.loadedUser.next(JSON.parse(user));
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.loadedUser.next(null);
    window.location.href = '/';
  }


  register(model : any) {
    return this.http.post<User>(this.baseUrl + "account/register", model).pipe(
      tap(
        res => {
          this.setCurrentUser(res);
        },
      )
    );
  }

  setCurrentUser(user : User) {
    this.loadedUser.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  changePassword(model: any) {
    return this.http.post(this.baseUrl + "account/change-password", model);
  }

  getProfile() {
    return this.http.get<Profile>(this.baseUrl + "account/profile");
  }

  updateKeyboardLayout(newLayout: string) {
    return this.http.get(this.baseUrl + "account/update-keyboard-layout?newLayout=" + newLayout);
  }
}