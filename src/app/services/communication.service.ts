import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  private statsUpdated = new Subject<void>();
  private presentationShared = new Subject<any>();

  statsUpdated$ = this.statsUpdated.asObservable();
  presentationShared$ = this.presentationShared.asObservable();

  notifyStatsUpdate() {
    this.statsUpdated.next();
  }

  notifyPresentationShared(course: any) {
    this.presentationShared.next(course);
  }
}
