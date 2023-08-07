import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, take } from 'rxjs';
import { User } from '../models/user';
import { getLocaleMonthNames } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  hubUrl = environment.hubBase;

  private hubConnection: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();
  constructor(private toaster: ToastrService, private router: Router) { }

  createHubConnection(user : User) {

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token 
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('UserIsOnline', username => {

      this.onlineUsers$.pipe(take(1)).subscribe({
        next: onlineUsers => {
          this.onlineUsersSource.next([...onlineUsers, username]);
        }
      })
      
    });

    this.hubConnection.on('UserIsOffline', username => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: onlineUsers => {
          this.onlineUsersSource.next(onlineUsers.filter(x => x !== username));
        }
      })
    });


    this.hubConnection.on('GetOnlineUsers', res => {
      this.onlineUsersSource.next(res);
    });


    this.hubConnection.on('ReciveInvite', username => {
      this.toaster.show('You recive invite from ' + username + ' click to accept it', 'Game invite', {
        timeOut: 10000,
        closeButton: true,
      })
      .onTap
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.hubConnection?.invoke('InviteAccepted', username).then()
            .catch(error => console.log(error));
          this.router.navigateByUrl('/multiplayer/typing-race?user=' + username);
        }
      })
    });

    this.hubConnection.on('InviteAccepted', username => {
      this.router.navigateByUrl('/multiplayer/typing-race?user=' + username);
    });
  }

  async sendInvite(recipentUsername: string) {
    return this.hubConnection?.invoke('SendInvite', recipentUsername)
      .catch(error => console.log(error));
  }


  stopHubConnection() {
    this.hubConnection.stop().catch(error => console.log(error));
  }
}