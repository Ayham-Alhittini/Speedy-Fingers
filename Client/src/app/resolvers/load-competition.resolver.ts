import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Competition } from '../models/competition';
import { CompetitionService } from '../services/competition.service';

@Injectable({
  providedIn: 'root'
})
export class LoadCompetitionResolver implements Resolve<Competition> {
  constructor(private competitionService: CompetitionService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Competition> {
    return this.competitionService.getCompetition();
  }
}