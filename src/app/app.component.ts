import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SwUpdate, VersionEvent} from '@angular/service-worker';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnInit {
  protected readonly title: string = 'angular-v17-pwa 18';
  protected disabled: boolean = true;

  @ViewChild('map')
  private readonly map?: ElementRef<HTMLDivElement> ;

  constructor(private readonly swUpdate: SwUpdate) {}

  protected async checkForUpdate(): Promise<void> {
    window.location.reload();
    this.disabled = true;
  }

  ngAfterViewInit(): void {
    // console.log(this.map?.nativeElement);
  }

  ngOnInit(): void {
    if(this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe((event: VersionEvent) => {
        console.log(event);

        if(event.type === 'VERSION_DETECTED') {
          this.disabled = false;
        }
      });
    }
  }
}
