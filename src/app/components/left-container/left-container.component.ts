import { WeatherService } from '../../Service/weather.service';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faLocation,faCloud,faCloudRain } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-left-container',
  standalone: true,
  imports: [FontAwesomeModule,],
  templateUrl: './left-container.component.html',
  styleUrl: './left-container.component.css'
})
export class LeftContainerComponent {

  // font awesome variables..
  faMagnifyingGlass:any = faMagnifyingGlass;
  faLocation: any = faLocation;

  // variables for temprature summary
  faCloud:any = faCloud;
  faCloudRain:any =faCloudRain;

  constructor(public weatherService:WeatherService){
  }
  onSearch(location:string){
    this.weatherService.cityName = location;
    this.weatherService.getData();
  }
}
