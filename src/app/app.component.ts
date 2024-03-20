import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SwPush, SwUpdate, VersionEvent} from '@angular/service-worker';
import {catchError, from, Observable, throwError} from 'rxjs';
import { io, Socket } from 'socket.io-client';

import { VapidKeys } from 'web-push';

import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnInit {
  private static readonly VAPID_PUBLIC_KEY: string = 'BJOBBq_yN7IvtfunHIEbfANiUIPvGdBx7SRYLXENDaFmfKEeUSeEfpHQgir0MXW5QqQByFD66SjydOJLA3qx94U';
  protected disabled: boolean = true;
  protected readonly title: string = 'angular-v17-pwa';
  protected readonly version: string = 'v63';
  protected readonly loremIpsum$: Observable<string[]>;
  protected readonly times$: Observable<string[]>;

  @ViewChild('container', { static: false, read: ElementRef })
  private readonly container?: ElementRef<HTMLDivElement>;

  constructor(
    private readonly renderer2: Renderer2,
    private readonly swUpdate: SwUpdate,
    private readonly swPush: SwPush,
    private readonly appService: AppService
  ) {
    // const socket: Socket = io();
    //
    // socket.on('connect', (): void => {
    //   console.log(socket.id);
    // });
    //
    // socket.on('disconnect', (): void => {
    //   console.log(socket.id);
    // });
    //
    // socket.on('data', (payload): void => {
    //   console.info(payload);
    // });

    this.loremIpsum$ = this.appService.loremIpsum$;
    this.times$ = this.appService.times$
  }

  protected checkForUpdate(): void {
    window.location.reload();

    this.disabled = true;
  }

  protected subscribeToNotifications(): void {
    from<Promise<PushSubscription>>(this.swPush.requestSubscription({
      serverPublicKey: AppComponent.VAPID_PUBLIC_KEY
    }))
    .pipe(catchError<PushSubscription, Observable<never>>(throwError))
    .subscribe(console.log);
  }

  ngAfterViewInit(): void {
    console.log(this.container);
    console.info(AppComponent.VAPID_PUBLIC_KEY);
  }

  ngOnInit(): void {
    if(this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe((event: VersionEvent): void => {
        const div: HTMLDivElement = this.renderer2.createElement('div');
        const text: string = this.renderer2.createText(JSON.stringify(event));

        this.renderer2.appendChild(div, text);
        this.renderer2.appendChild(this.container?.nativeElement, div);

        if(event.type === 'VERSION_DETECTED') {
          this.disabled = false;
        }
      });
    }
  }
}
