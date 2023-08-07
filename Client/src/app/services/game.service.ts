import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  hubUrl = environment.hubBase;

  private hubConnection: HubConnection;
  constructor() { }

  MAX_PROGRESS_PIXELS_LENGTH = 982.00;
  WORDS_LENGTH = 0;

  opponentProgressTrigger = new EventEmitter<void>();
  quitEmitter = new EventEmitter<string>();
  gameWordsSource = new EventEmitter<string[]>();

  createHubConnection(user : User, otherUsername: string) {

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'game?user=' + otherUsername, {
        accessTokenFactory: () => user.token 
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on("ProgressTrigger", () => {
      this.opponentProgressTrigger.emit();
    });

    this.hubConnection.on("ReciveWords", words => {
      this.WORDS_LENGTH = words.length;
      this.gameWordsSource.emit(words);
    });

    this.hubConnection.on('PlayerQuit', playerName => {
      this.quitEmitter.emit(playerName);
    });
  }

  async ProgressTrigger(otherPlayer: string) {
    return this.hubConnection?.invoke('ProgressTrigger', otherPlayer)
      .catch(error => console.log(error));
  }

  async Quit() {
    return this.hubConnection?.invoke('Quit')
      .catch(err => console.log(err));
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop().catch(error => console.log(error));
    }
  }
}
