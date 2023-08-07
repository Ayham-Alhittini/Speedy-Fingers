import { Component, OnInit } from '@angular/core';
import { CompetitionService } from '../services/competition.service';
import { Competition } from '../models/competition';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../services/account.service';
import { User } from '../models/user';
import { concatWith, take } from 'rxjs';
import { result } from '../models/result';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.css']
})
export class CompetitionComponent implements OnInit{
  competition: Competition = null;
  user: User = null;
  loading = true;
  compititionFinshed = false;

  handleCountDown(event) {
    if (event.action === 'done') {
      window.location.href = '/competition'
    }
  }


  constructor(private competitionService: CompetitionService, private route: ActivatedRoute,
    private accountService: AccountService, private toaster: ToastrService){

      this.accountService.loadedUser.pipe(take(1)).subscribe({
        next: response => {
          this.user = response;
        }
      });

    }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.competition = data['competition'];
      }
    });

    this.competitionService.checkState().subscribe({
      next: response => {
        this.compititionFinshed = !response['contestRunning'];
        // this.compititionFinshed = false;
      }
    })
    this.loading = false;
  }

  getCompetitionResult(result: result) {
    if (!this.user) return;
    this.competitionService.saveScore({
      competitionId: this.competition.id,
      wpm: result.wpm,
      keystrokes: result.keystrokesCorrect
    }).subscribe({
      next: response => {
        console.log(response);
        this.showScore(result);
      }
    });
  }

  getTime() {
    return this.competition.time.hours * 3600 + this.competition.time.minutes * 60 + this.competition.time.seconds + 30;
  }

  showScore(result: result) {
    if (!this.user) return;

    ///check if exist on rank list
    let _index = -1;
    for (let index = 0; index < this.competition.users.length; index++) {
      const element = this.competition.users[index];
      if (element.userName === this.user.username) {
        _index = index;
        break;
      }
    }

    if (_index !== -1) {
      this.competition.users[_index].wpm = Math.max(result.wpm, this.competition.users[_index].wpm);
      this.competition.users[_index].keystrokes = Math.max(result.keystrokesCorrect,
         this.competition.users[_index].keystrokes);
    } else {
      this.competition.users.push({
        userName: this.user.username,
        wpm: result.wpm,
        keystrokes: result.keystrokesCorrect
      });
    } 
    this.competition.users.sort((a, b) => b.wpm - a.wpm);
    this.competition.testsTaken += 1;
    this.toaster.info("Your score have been saved");
  }
}
