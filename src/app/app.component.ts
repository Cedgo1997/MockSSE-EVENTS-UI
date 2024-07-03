import {Component, OnInit} from '@angular/core';
import { EventService } from './services/event.service';
import {WebSocket2Service} from "./services/websocket2.service";
import {WebSocket1Service} from "./services/websocket1.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'event-front';
  userIds: string = '';
  url: string = '';
  token: string = '';
  events: any[] = [];

  constructor(private eventService: EventService,
              private webSocket1: WebSocket1Service,
              private webSocket2: WebSocket2Service) {
  }

  ngOnInit() {
  }

  connect(): void {
    const campaignIds = [1988];
    this.webSocket1.createSocket(this.url, 1, campaignIds, this.token);
    this.webSocket2.createSocket(this.url, 2, campaignIds, this.token);

    this.events.push({
      userId: 1,
      data: []
    });
    this.events.push({
      userId: 2,
      data: []
    })


    this.webSocket1.listen("").subscribe(value => {
      debugger
    });


    this.webSocket2.getMessage().subscribe((message: string) => {
      this.events.map(value => {
        if (value.userId == 2) {
          value.data.push(message);
        }
      })
    });

    /*
    this.eventService.closeEventSources();

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        let id = Math.floor(Math.random() * (1000 - 0 + 1) + 0);
        this.events.push({
          userId: id,
          data: []
        });

        this.eventService.listenToCampaignsEvents(this.url, id, campaignIds,this.token);
        this.eventService.getEvents().subscribe((event: any) => {
          if (event.data.type) {
            this.events.map(value => {
              if (value.userId == event.userId) {
                  value.data= event.data;
              }
            });
          }
        });
      }, 30)
    }*/
  }
}
