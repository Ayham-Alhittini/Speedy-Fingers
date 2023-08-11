import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TypingTestComponent } from './typing-test/typing-test.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SharedModule } from './modules/shared.modules';
import { ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { ProfileComponent } from './profile/profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FloorPipe } from './Pipes/floor.pipe';
import { CompetitionComponent } from './competition/competition.component';
import { CompetitionTypingTestComponent } from './competition/competition-typing-test/competition-typing-test.component';
import { MultiplayerComponent } from './multiplayer/multiplayer.component';
import { MultiplayerTypingTestComponent } from './multiplayer/typing-race/multiplayer-typing-test/multiplayer-typing-test.component';
import { TypingRaceComponent } from './multiplayer/typing-race/typing-race.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';

@NgModule({
  declarations: [
    AppComponent,
    TypingTestComponent,
    MenuComponent,
    LoginComponent,
    NavbarComponent,
    ProfileComponent,
    FloorPipe,
    CompetitionComponent,
    CompetitionTypingTestComponent,
    MultiplayerComponent,
    MultiplayerTypingTestComponent,
    TypingRaceComponent,
    ServerErrorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    {provide : HTTP_INTERCEPTORS, useClass : ErrorInterceptor, multi : true},
    {provide : HTTP_INTERCEPTORS, useClass : JwtInterceptor, multi : true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
