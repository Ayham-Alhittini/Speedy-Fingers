import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { result } from '../../models/result';

@Component({
  selector: 'app-competition-typing-test',
  templateUrl: './competition-typing-test.component.html',
  styleUrls: ['./competition-typing-test.component.css']
})
export class CompetitionTypingTestComponent implements OnInit {

  @Input('words') wordsSrc : string[];
  @Output('competition-result') competitionResult = new EventEmitter<result>();
  words: string[] = [];
  

  MAX_LINE_PIXELs_LENGTH = 810;
  boardLine1: string[] = [];
  boardLine2: string[] = [];

  currentWord = 0;
  wrongHint = -1;
  inputContent = '';
  timer: any;
  isTimerRunning: boolean = false;
  second = 60;

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
  }

  restartTest() {
    this.stopTimer();
    this.second = 60;
    
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

    var parentElement = document.getElementById("line-1");
    var childElements = parentElement.getElementsByClassName("line-1-childs");
    for (var i = 0; i < childElements.length; i++) {
      childElements[i].classList.remove("text-success");
      childElements[i].classList.remove("text-danger");
    }
    
  }

  onInputChange(e: KeyboardEvent) {
    if (this.testActive) {
      this.startTimer();
      if (e.code === 'Space') {
        if (this.inputContent.at(0) != ' ')
        {
          if (this.inputContent === this.boardLine1[this.currentWord] + ' ')
          {
            this.goCorrect();
          }
          else
          {
            this.goWrong();
          }
        }
        this.inputContent = '';
        this.wrongHint = -1;
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

  getTime(second: number): string {
    return second >= 10 ? second + '' : '0' + second;
  }
  
  


  private startTimer() {
    if (!this.isTimerRunning && this.testActive) {
      this.timer = setInterval(() => {
        this.second--;
        if (this.second === 0) {
          this.timeout();
        }
      }, 1000);
      this.isTimerRunning = true;
    }
  }

  timeout() {
    this.calculateResult();
    this.testActive = false;
    this.inputContent = '';
    this.stopTimer();
    this.competitionResult.emit(this.result);
  }

  private calculateResult() {
    this.result.dirty = true;
    this.result.wpm = Math.ceil(this.userCount.keystrokesCorrect / 5.0);

    this.result.accuracy = this.userCount.keystrokesCorrect * 1.00 / (this.userCount.keystrokesCorrect + this.userCount.keystrokesWrong);

    this.result.correctWords = this.userCount.correctWords;
    this.result.wrongWords = this.userCount.wrongWords;
    this.result.keystrokesCorrect = this.userCount.keystrokesCorrect;
    this.result.keystrokesWrong = this.userCount.keystrokesWrong;

    // console.log(this.result);
  }

  private stopTimer() {
    if (this.isTimerRunning) {
      clearInterval(this.timer);
      this.isTimerRunning = false;
    }
  }

  private fillLine(lineNumber: number) {
    let pixelsSum = 0;
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
    this.words = this.wordsSrc.slice();
    this.fillLine(1);
    this.fillLine(2);
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
    this.go();
  }

  private goWrong() {
    const element = document.getElementById(this.currentWord + '');
    element.classList.add('text-danger');
    this.userCount.wrongWords++;
    this.userCount.keystrokesWrong += this.words[this.currentWord].length + 1;
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