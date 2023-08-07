import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypingTestComponent } from './typing-test/typing-test.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { CompetitionComponent } from './competition/competition.component';
import { LoadCompetitionResolver } from './resolvers/load-competition.resolver';
import { MultiplayerComponent } from './multiplayer/multiplayer.component';
import { TypingRaceComponent } from './multiplayer/typing-race/typing-race.component';

const routes: Routes = [
  {path : '', component : TypingTestComponent},
  {path : 'typing-test', component : TypingTestComponent},
  {path : 'advance-typing-test', component : TypingTestComponent},
  {path: 'login', component: LoginComponent},
  {path: 'create-account', component: LoginComponent, data: {createAccount : true}},
  {path: 'profile', component: ProfileComponent},
  {path: 'competition', component: CompetitionComponent, resolve: {competition: LoadCompetitionResolver}},
  {path: 'multiplayer', component: MultiplayerComponent},
  {path: 'multiplayer/typing-race', component: TypingRaceComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
