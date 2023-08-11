import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { User } from '../models/user';
import { Subscription, take } from 'rxjs';
import { PresenceService } from '../services/presence.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatchesService } from '../services/matches.service';

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.css']
})
export class MultiplayerComponent implements OnInit, OnDestroy {

  
  user: User;
  onlineUsers : string[] = [];

  onlineUsersSrc:string[] = [];

  searchForMatches = false;
  searchTimerCount = 0;
  intervalId: any;

  constructor(private accountService: AccountService, public presenceService: PresenceService, private matchesService: MatchesService,
    private router: Router, private toaster: ToastrService){

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

    this.inviteAccepted();
    this.matchesFound();
  }
  
  private inviteAccepted() {
    this.presenceService.inviteAcceptedEmitter.subscribe((username: string) => {
      this.presenceService.stopHubConnection();
      setTimeout(() => {
        this.router.navigateByUrl('/multiplayer/typing-race?user=' + username);
      }, 1000);
    })
  }

  matchesFound() {
    this.matchesService.findMatchEmitter.subscribe({
      next: matchName => {
        this.matchesService.stopHubConnection();
        this.searchForMatches = false;

        //stop match search
        if (this.intervalId !== null) {
          clearInterval(this.intervalId);
          this.intervalId = null;
        }

        ////navigate to typing race
        this.router.navigateByUrl('/multiplayer/typing-race?user=' + matchName);
      }
    })
  }


  findMatches() {
    this.searchForMatches = true;
    this.searchTimerCount = 0;
    this.presenceService.stopHubConnection();
    this.matchesService.createHubConnection(this.user.token);
    this.intervalId = setInterval(() => {
        this.searchTimerCount += 1;
        if (this.searchTimerCount === 100) {///timeout
          this.cancelMatchesSearch();
          this.toaster.error("Does not find matches!!!");
        }
    }, 1000);
  }

  cancelMatchesSearch() {
    this.matchesService.stopHubConnection();
    this.presenceService.createHubConnection(this.user);
    this.searchForMatches = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
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
