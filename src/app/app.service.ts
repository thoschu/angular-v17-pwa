import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public readonly loremIpsum$: Observable<string[]>;
  public readonly times$: Observable<string[]>;

  constructor(readonly httpClient: HttpClient) {
    this.loremIpsum$ = httpClient.get<Record<'payload', string[]>>('/lorem-ipsum')
      .pipe(map<Record<'payload', string[]>, string[]>((val: Record<'payload', string[]>) => val.payload));

    this.times$ = httpClient.get<Record<'payload', string[]>>('/times?amount=11')
      .pipe(map<Record<'payload', string[]>, string[]>((val: Record<'payload', string[]>) => val.payload));
  }

  public addPushSubscription(pushSubscription: PushSubscription): Observable<PushSubscription> {
    return this.httpClient.post<PushSubscription>('/push-subscription', pushSubscription);
  }

  public send(message: string): Observable<string> {
    return this.httpClient.post<string>('/do-notification', message);
  }
}
