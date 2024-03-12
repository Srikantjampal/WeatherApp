import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LeftContainerComponent } from "./components/left-container/left-container.component";
import { RightContainerComponent } from "./components/right-container/right-container.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [CommonModule, RouterOutlet, LeftContainerComponent, RightContainerComponent,FontAwesomeModule]
})
export class AppComponent {
  title = 'WeatherForecast';
}
