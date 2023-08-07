import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WordsGenerateService {
  baseUrl = environment.apiBaseUrl + 'wordsgenerator';

  level = 'easy';
  activeIndex = -1;
  changeLevel = new EventEmitter<void>();

  constructor(private http: HttpClient){}
  generateWords() {
    return this.http.get<string[]>(this.baseUrl + '/generate-words?level=' + this.level);
  }
  
  resultSynchronization(model: any) {
    return this.http.post(this.baseUrl + '/result-synchronization', model);
  }
}
