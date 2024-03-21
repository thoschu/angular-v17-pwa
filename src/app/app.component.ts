import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwPush, SwUpdate, VersionEvent } from '@angular/service-worker';
import { catchError, from, noop, Observable, Subscription, throwError} from 'rxjs';

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
export class AppComponent implements AfterViewInit, OnDestroy, OnInit {
  private static readonly VAPID_PUBLIC_KEY: string = 'BO1GTa3kXP8unlB0ssLgS6N75qOlhOLoplx-C5aGMOCcQW96CuQT6gZ4n0wOe1a8LWLDJP2uVqGM3OtRvmg2xok';
  protected disabled: boolean = true;
  protected readonly title: string = 'angular-v17-pwa';
  protected readonly version: string = 'v91';
  protected readonly loremIpsum$: Observable<string[]>;
  protected readonly times$: Observable<string[]>;
  protected subscription: Subscription | null = null;

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
    this.subscription = from<Promise<PushSubscription>>(this.swPush.requestSubscription({
      serverPublicKey: AppComponent.VAPID_PUBLIC_KEY
    }))
    .pipe(catchError<PushSubscription, Observable<never>>(throwError))
    .subscribe((pushSubscription: PushSubscription): void => {
      this.appService.addPushSubscription(pushSubscription)
        .subscribe(
          console.log,
          console.error,
          () => console.info('chrome://settings/content/notifications')
        );
    });
  }

  protected send(): void {
    this.appService.send({message: 'Hello, World!'}).subscribe((response: Record<'message', any>): void => {
      console.info(response);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
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
