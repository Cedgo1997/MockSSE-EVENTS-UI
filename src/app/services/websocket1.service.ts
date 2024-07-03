import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import * as socketio from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocket1Service {
  private socket: socketio.Socket | null = null;
  private subject: Subject<string> = new Subject<string>();

  constructor() {
  }

  createSocket(url: string, userId: number, campaignsId: number[], token: string) {
    const options = {
      path: `ws://${url}?userId=${userId}&campaignIds=${campaignsId}`,
      extraHeaders: {
        Authorization: 'Bearer ' + token
      }
    };

    this.socket = socketio.connect(options);

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('message', (message: string) => {
      console.log('Received message: ' + message);
    });
  }

  sendMessage(msg: string) {
    this.socket?.send(msg);
  }

  getMessage(): Observable<string> {
    return this.subject.asObservable();
  }

  public listen(event: string): Observable<any> {
    return new Observable(observer => {
      this.socket?.on(event, data => {
        debugger
        observer.next(data);
      });
    });
  }
}
