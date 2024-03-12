import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import{faThumbsUp , faThumbsDown,faFaceSmile,faFaceFrown} from '@fortawesome/free-solid-svg-icons'
import { WeatherService } from '../../Service/weather.service';
import { CardsComponent } from "../cards/cards.component";
@Component({
    selector: 'app-right-container',
    standalone: true,
    templateUrl: './right-container.component.html',
    styleUrl: './right-container.component.css',
    imports: [CommonModule, FontAwesomeModule, CardsComponent]
})
export class RightContainerComponent {

  // icons
  faThumbsUp:any=faThumbsUp;
  faThumbsDown:any =faThumbsDown;
  faFaceSmile:any = faFaceSmile;
  faFaceFrown:any =faFaceFrown;

  constructor(public weatherService:WeatherService){}

  onTodayClick(){
    this.weatherService.today=true;
    this.weatherService.week=false;
  }

  onWeekClick(){
    this.weatherService.week=true;
    this.weatherService.today=false;
  }

  onCelsiusclick(){
    this.weatherService.celsius=true;
    this.weatherService.fahrenhiet=false;
  }

  onFahrenheit(){
    this.weatherService.fahrenhiet=true;
    this.weatherService.celsius=false;
  }


}
