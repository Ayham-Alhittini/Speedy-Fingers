import { Component, OnInit } from '@angular/core';
import { WordsGenerateService } from '../services/words-generate.service';
import { AccountService } from '../services/account.service';
import { take } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(public accountService: AccountService){}
}
