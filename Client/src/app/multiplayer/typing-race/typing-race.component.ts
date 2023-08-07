import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { take } from 'rxjs';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-typing-race',
  templateUrl: './typing-race.component.html',
  styleUrls: ['./typing-race.component.css']
})
export class TypingRaceComponent implements OnInit, OnDestroy {
  yourProgress = 0;
  opponentProgress = 0;
  winner = null;
  user: User;
  otherUser: string;
  yourWordsCount = 0;
  opponentWordsCount = 0;

  constructor(private gameService: GameService, private accountService: AccountService,
    private route: ActivatedRoute, private router: Router){
    accountService.loadedUser.pipe(take(1)).subscribe(Response => {
      this.user = Response;
    });

    ////to check if page reloaded
    window.addEventListener('load', () => {
      this.router.navigateByUrl('/multiplayer');
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.otherUser = params['user'];
      if (this.otherUser) {
        this.gameService.createHubConnection(this.user, this.otherUser);
      }
    });

    this.updateOpponentProgress();

    this.checkQuit();
  }


  checkQuit() {
    this.gameService.quitEmitter.subscribe(plyaerName => {
      if (plyaerName !== this.user.username && this.winner === null) {
        this.GameFinsh(this.user.username);
      }
    });
  }

  private updateOpponentProgress() {
    this.gameService.opponentProgressTrigger.subscribe(() => {
      this.opponentProgress += this.gameService.MAX_PROGRESS_PIXELS_LENGTH / this.gameService.WORDS_LENGTH;
      this.opponentProgress = Math.min(this.opponentProgress, 982);

      this.opponentWordsCount += 1;
      if (this.opponentWordsCount === this.gameService.WORDS_LENGTH) {///982 = max progress pixels length
        this.GameFinsh(this.otherUser);
      }
    });
  }
  
  public progressIncreased() {
    this.yourProgress += this.gameService.MAX_PROGRESS_PIXELS_LENGTH / this.gameService.WORDS_LENGTH;
    this.yourProgress = Math.min(this.yourProgress, 982);
    if (this.otherUser) {
      this.gameService.ProgressTrigger(this.otherUser).then()
      .catch(err => console.log(err));
    }
    this.yourWordsCount += 1;
    if (this.yourWordsCount === this.gameService.WORDS_LENGTH) {
      this.GameFinsh(this.user.username);
    }
  }

  private GameFinsh(winner: string) {
    this.winner = winner;
    this.gameService.stopHubConnection();
  }

  ngOnDestroy(): void {
    if (this.winner === null) {
      this.gameService.Quit().then(() => {
        this.gameService.stopHubConnection();
      });
    }
  }
}
