import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Competition } from '../models/competition';
import { CompetitionRank } from '../models/competitionRank';

@Injectable({
  providedIn: 'root'
})
export class CompetitionService {

  baseUrl = environment.apiBaseUrl + "competition/";
  constructor(private http: HttpClient) { }

  checkState() {
    return this.http.get(this.baseUrl + "check-state");
  }

  getCompetition() {
    return this.http.get<Competition>(this.baseUrl + "get-competition");
  }

  saveScore(model: any) {
    return this.http.post(this.baseUrl + "save-score", model);
  }

  getLastCompetitionResult() {
    return this.http.get<CompetitionRank[]>(this.baseUrl + "last-competition-result");
  }
}
