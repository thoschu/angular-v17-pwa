import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate, VersionEvent } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnInit {
  protected readonly title: string = 'angular-v17-pwa 25';
  protected disabled: boolean = true;

  @ViewChild('container', { static: false, read: ElementRef })
  private readonly container?: ElementRef<HTMLDivElement>;

  constructor(private readonly renderer2: Renderer2, private readonly swUpdate: SwUpdate) {}

  protected checkForUpdate(): void {
    window.location.reload();

    this.disabled = true;
  }

  ngAfterViewInit(): void {
    console.log(this.container);
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
