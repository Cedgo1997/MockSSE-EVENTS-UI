import { Component } from '@angular/core';
import { EventService } from './services/event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'event-front';
  userIds: string = '';
  url: string = '';
  events: any[] = [];

  constructor(private eventService: EventService) {
    this.eventService.getEvents().subscribe((event: any) => {
      this.events.push(event);
    });
  }

  connect(): void {
    const userIdArray = this.userIds.split(',').map(id => parseInt(id.trim()));
    const campaignIds = [1988];
    this.eventService.closeEventSources();
    userIdArray.forEach(userId => {
      if (!isNaN(userId)) {
        this.eventService.listenToCampaignsEvents(this.url, userId, campaignIds);
      }
    });
  }
}
