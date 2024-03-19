import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public readonly loremIpsum$: Observable<string[]>;

  constructor(readonly httpClient: HttpClient) {
    this.loremIpsum$ = httpClient.get<Record<'payload', string[]>>('/lorem-ipsum')
      .pipe(map<Record<'payload', string[]>, string[]>((val: Record<'payload', string[]>) => val.payload));
  }
}
