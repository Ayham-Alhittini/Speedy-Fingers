import { Component, OnDestroy, OnInit } from '@angular/core';
import { WordsGenerateService } from '../services/words-generate.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy{
  
  routerEvents: any;

  constructor(public wordsGeneratorService: WordsGenerateService, private router: Router){
    this.routerEvents = this.router.events.subscribe({
      next: (event: any) => {
        if(event instanceof NavigationEnd){
          const url = event.url;

          if (url === '/' || url === '/typing-test') {
            this.setIndex(1);
          } else if (url === '/advance-typing-test') {
            this.setIndex(2);
          } else if (url.indexOf('/multiplayer') !== -1) {
            this.setIndex(3);
          } else if (url === '/competition') {
            this.setIndex(4);
          }

        }
      }
    })
  }

  ngOnInit(): void {
    
  }

  setIndex(index: number) {

    this.wordsGeneratorService.activeIndex = index;

    if (index === 2) {
      this.wordsGeneratorService.level = 'advanced';
      this.wordsGeneratorService.changeLevel.emit();
    } else if(index !== -1) {
      this.wordsGeneratorService.level = 'easy';
      this.wordsGeneratorService.changeLevel.emit();
    }
  }

  ngOnDestroy(): void {
    this.routerEvents.unsubscribe();
    // Unsubscribe to avoid memory leak
  }
}
