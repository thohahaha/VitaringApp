import { Component, OnInit } from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonIcon
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { addIcons } from 'ionicons';
import { 
  trendingUp,
  radioButtonOn,
  moon,
  heart,
  speedometer,
  flash,
  timer, 
  moonOutline } from 'ionicons/icons';

interface TrainingZone {
  zone: string;
  colorClass: string;
  percentage: number;
  time: string;
}

interface HistoricalDay {
  name: string;
  height: number;
}

interface Device {
  sleepGoalAchieved: boolean;
}

@Component({
  selector: 'app-performa',
  templateUrl: './performa.page.html',
  styleUrls: ['./performa.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    NavbarComponent
  ]
})
export class PerformaPage implements OnInit {

  selectedDevice: Device = {
    sleepGoalAchieved: true
  };

  historicalDays: HistoricalDay[] = [
    { name: 'Sen', height: 65 },
    { name: 'Sel', height: 82 },
    { name: 'Rab', height: 45 },
    { name: 'Kam', height: 90 },
    { name: 'Jum', height: 78 },
    { name: 'Sab', height: 95 },
    { name: 'Min', height: 30 }
  ];

  trainingZones: TrainingZone[] = [
    { zone: 'Zona 1 - Pemulihan', colorClass: 'bg-blue-400', percentage: 25, time: '1j 15m' },
    { zone: 'Zona 2 - Aerobik', colorClass: 'bg-green-400', percentage: 45, time: '2j 30m' },
    { zone: 'Zona 3 - Tempo', colorClass: 'bg-yellow-400', percentage: 20, time: '45m' },
    { zone: 'Zona 4 - Ambang', colorClass: 'bg-orange-400', percentage: 8, time: '20m' },
    { zone: 'Zona 5 - Anaerobik', colorClass: 'bg-red-400', percentage: 2, time: '5m' }
  ];

  constructor() {
    // Add icons
    addIcons({trendingUp,moonOutline,'target':radioButtonOn,moon,heart,speedometer,flash,timer});
  }

  ngOnInit() {
    this.loadPerformanceData();
  }

  loadPerformanceData() {
    // Load performance data from service
    console.log('Loading performance data...');
  }
}
