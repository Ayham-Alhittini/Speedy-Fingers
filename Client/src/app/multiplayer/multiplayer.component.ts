import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { User } from '../models/user';
import { Subscription, take } from 'rxjs';
import { PresenceService } from '../services/presence.service';

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.css']
})
export class MultiplayerComponent implements OnInit, OnDestroy {

  
  user: User;
  onlineUsers : string[] = [];

  onlineUsersSrc:string[] = [];

  constructor(private accountService: AccountService, public presenceService: PresenceService){

    accountService.loadedUser.pipe(take(1)).subscribe({
      next: Response => this.user = Response
    })
  }
  private onlineUsersSubscription: Subscription;

  ngOnInit() {
    this.presenceService.createHubConnection(this.user);

    this.onlineUsersSubscription = this.presenceService.onlineUsers$.subscribe(
      (onlineUsers) => {
        this.onlineUsers = onlineUsers.filter(username => username !== this.user.username);
        // this.onlineUsers = ['ayham', 'molham', 'means', 'ahmad'];
        this.onlineUsersSrc = this.onlineUsers.slice();
      }
    );
  }

  sendInvite(recipentUsername: string) {
    this.presenceService.sendInvite(recipentUsername).then();
  }

  onSearchInputChange(event) {
    this.onlineUsers = this.onlineUsersSrc.slice();
    this.onlineUsers = this.onlineUsers.filter(u => u.substring(0, event.value.length).toLowerCase() === event.value.toLowerCase());
  }

  ngOnDestroy() {
    if (this.onlineUsersSubscription) {
      this.onlineUsersSubscription.unsubscribe();
      this.presenceService.stopHubConnection();
    }
  }
}
