import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor() { }
  private eventSources: { [key: string]: EventSource } = {};
  private eventDataBS: Subject<any> = new Subject();
  private eventErrorBS: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  listenToCampaignsEvents(url: string, userId: number, campaignIds: number[]): void {
    const eventSourceKey = `${url}/events/generic/${userId}`;
    this.eventSources[eventSourceKey] = new EventSource(`${eventSourceKey}?campaignIds=${campaignIds}`);

    this.eventSources[eventSourceKey].addEventListener("Notification", (event: Partial<MessageEvent>) => {
      this.eventDataBS.next(JSON.parse(event.data));
    });
  }

  closeEventSources() {
    for (const key in this.eventSources) {
      if (this.eventSources[key]) {
        this.eventSources[key].close();
      }
    }
    this.eventSources = {};
    this.eventDataBS.complete();
    this.eventDataBS = new Subject();
  }

  getEvents(): Observable<any> {
    return this.eventDataBS.asObservable();
  }

  getEventsError(): Observable<boolean> {
    return this.eventErrorBS.asObservable();
  }

  setEventsError(status: boolean): void {
    this.eventErrorBS.next(status);
  }
}
