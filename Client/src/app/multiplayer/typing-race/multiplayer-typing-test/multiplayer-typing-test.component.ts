import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { result } from 'src/app/models/result';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { GameService } from 'src/app/services/game.service';
import { WordsGenerateService } from 'src/app/services/words-generate.service';

@Component({
  selector: 'app-multiplayer-typing-test',
  templateUrl: './multiplayer-typing-test.component.html',
  styleUrls: ['./multiplayer-typing-test.component.css']
})
export class MultiplayerTypingTestComponent implements OnInit{
  user: User;
  @Output('make-progress') progress = new EventEmitter<void>();

  constructor(private wordsGeneratorService: WordsGenerateService, private accountService: AccountService,
    private gameService: GameService, private router: Router)
  {
    accountService.loadedUser.pipe(take(1)).subscribe({
      next: response => {
        this.user = response;
      }
    });
  }
  words: string[] = [];
  
  MAX_LINE_PIXELs_LENGTH = 910;
  
  
  boardLine1: string[] = [];
  boardLine2: string[] = [];

  currentWord = 0;
  wrongHint = -1;
  inputContent = '';

  result: result = {
    wpm: 0,
    correctWords: 0,
    wrongWords: 0,
    keystrokesCorrect: 0,
    keystrokesWrong: 0,
    dirty: false,
    accuracy: 0
  }

  userCount : {wrongWords: number, correctWords: number, keystrokesCorrect: number, keystrokesWrong: number} = {
    wrongWords: 0,
    correctWords: 0,
    keystrokesCorrect: 0,
    keystrokesWrong: 0
  }
  
  testActive = true;

  ngOnInit(): void {
    this.getWords();
    this.wordsGeneratorService.changeLevel.subscribe({
      next : () => {
        this.restartTest();
      }
    })
  }

  restartTest() {
    this.userCount = {
      wrongWords: 0,
      correctWords: 0,
      keystrokesCorrect: 0,
      keystrokesWrong: 0
    };

    this.testActive = true;
    this.currentWord = 0;
    this.wrongHint = -1
    this.inputContent = '';
    this.boardLine1.splice(0);
    this.boardLine2.splice(0);
    this.getWords();
  }

  onInputChange(e: KeyboardEvent) {
    if (this.testActive) {
      if (e.code === 'Space') {
        if (this.inputContent.at(0) != ' ')
        {
          if (this.inputContent === this.boardLine1[this.currentWord] + ' ')
          {
            this.goCorrect();
          }
          this.inputContent = '';
          this.wrongHint = -1;
        }
      } else {
        if (this.inputContent.length > 0 && this.inputContent.at(this.inputContent.length - 1) !== ' ') {
          if (this.inputContent != this.boardLine1[this.currentWord].substring(0, this.inputContent.length)) {
            this.wrongHint = this.currentWord;
          } else {
            this.wrongHint = -1;
          }
        } else {
          this.wrongHint = -1;
        }
      }
    }
  }

  private fillLine(lineNumber: number) {
    let pixelsSum = 0;

    if (lineNumber === 1) {
      this.boardLine1.splice(0);
    } else {
      this.boardLine2.splice(0);
    }
    while (this.words.length > 0)
    {
      let wordLength = this.getLengthInPixels(this.words[0]) + 4;
      if (pixelsSum + wordLength <= this.MAX_LINE_PIXELs_LENGTH)
      {
        if (lineNumber === 1) 
        {
          this.boardLine1.push(this.words[0]);
        }
        else
        {
          this.boardLine2.push(this.words[0]);
        }

        pixelsSum += wordLength;
        this.words.splice(0, 1);
      }
      else
      {
        break;
      }
    }
  }
  
  private getWords() {
    this.gameService.gameWordsSource.subscribe(words => {
      this.words = words.slice();
      this.fillLine(1);
      this.fillLine(2);
    })

  }
  
  private go() {
    if (this.currentWord + 1 < this.boardLine1.length) {
      this.currentWord++;
    } else {
      this.currentWord = 0;
      this.boardLine1 = this.boardLine2.slice();
      this.boardLine2.splice(0);
      this.fillLine(2);
    }
  }

  private goCorrect() {
    const element = document.getElementById(this.currentWord + '');
    element.classList.add('text-success');
    this.userCount.correctWords++;

    this.userCount.keystrokesCorrect += this.boardLine1[this.currentWord].length + 1;
    this.progress.emit();
    this.go();

  }


  private getLengthInPixels(word: string) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    ctx.font = "30.8px Times New Roman";        
    var width = ctx.measureText(word).width;

    return width;
  }
  
}
