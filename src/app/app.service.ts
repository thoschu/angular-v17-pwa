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
      .pipe(
        map<Record<'payload', string[]>, string[]>((val: Record<'payload', string[]>) => val.payload)
      );

    this.times$ = httpClient.get<Record<'payload', string[]>>('/times?amount=11')
      .pipe(
        map<Record<'payload', string[]>, string[]>((val: Record<'payload', string[]>) => val.payload)
      );
  }

  public shuffleArray<T>(array: T[]): T[] {
    let arrayCopy: T[] = [...array];

    for (let i: number = arrayCopy.length - 1; i > 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1));

      [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
    }

    return arrayCopy;
  }
}
