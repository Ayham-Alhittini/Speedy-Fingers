import { Component, OnInit } from '@angular/core';
import { WordsGenerateService } from './services/words-generate.service';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private accountService: AccountService){}
  title = 'SpeedyFingers';

  ngOnInit(): void {
    this.accountService.autoLogin();
  }
}
