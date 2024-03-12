import { CommonModule } from '@angular/common';
import { WeatherService } from './../../Service/weather.service';
import { Component } from '@angular/core';
import { WeekData } from '../../Models/WeekData';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent {

  constructor(public weatherService:WeatherService){


  }

  list:WeekData[]= this.weatherService.weekData;

  ngOnInit(){
    this.weatherService.weekData.slice(0,7);

  }

}
