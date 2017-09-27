import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { StatisticsPage } from '../statistics/statistics';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = StatisticsPage;

  constructor() {

  }
}
