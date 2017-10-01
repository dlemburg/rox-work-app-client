import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api, ROUTES } from '../../utils/api';
import { Utils } from '../../utils/utils';


@IonicPage()
@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html',
})
export class StatisticsPage {
  startDate: string = null;
  endDate: string = null;
  months = Utils().months;

  state = {
    avgForecastHours: null,
    avgActualHours: null,
    dates: []
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public Api: Api) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatisticsPage');
  }

  filterChange() {
    console.log("this.startDate: ", this.startDate);
    console.log("this.endDate: ", this.endDate);
    
    if (this.startDate && this.endDate) {
      this.Api.call(ROUTES.getFilteredData + `?startDate=${this.startDate}&endDate=${this.endDate}`, "GET")
        .then((response) => {
          console.log("response.data: ", response.data);

          if (response.data.filteredData.dates.length) {
            this.state = {
              avgForecastHours: response.data.filteredData.avgForecastHours,
              avgActualHours: response.data.filteredData.avgActualHours,
              dates: response.data.filteredData.dates
            }
          }
        })
        .catch((err) => {
          console.log("err: ", err);
        })
    }
    
  }

  /*
    avg truck hours
    avg actual hours
  */

}
