import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Utils } from '../../utils/utils';
import { Api, ROUTES } from '../../utils/api';

@IonicPage()
@Component({
  selector: 'page-truck-data',
  templateUrl: 'truck-data.html',
})
export class TruckDataPage {
  isUpdate: boolean = false;
  dateStr: string;
  state: ITruckData = {
    oid: null,
    forecastGM: 0,
    forecastCS: 0,
    actualCS: 0,
    actualGM: 0,
    scheduledHours: 0,
    flexHours: 0,
    day: null,
    month: null,
    date: null,
    year: null,
    dateStr: null,
    totalForecastHours: 0, // not in db
    totalActualHours: 0,   // not in db

  }
  dateFiltered: string;
  CASES_PER_HOUR: number = 25;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public Api: Api) {
  }

  ionViewDidLoad() {
    let date = new Date(this.navParams.data.date);

    console.log("date: ", date);

    this.state = Object.assign({}, this.state, {
      day: date.getDay(),
      month: Utils().months[date.getMonth()].month,
      date: date.getDate(),
      year: date.getFullYear(),
      dateStr: Utils().toLocalIsoString(date.toString())
    })

    console.log("this.state: ", this.state);
    // for view
    this.dateFiltered = this.dateFilter(this.navParams.data.date);    
    this.getData(this.state);
  }

  dateFilter(incomingDate) {
    let date = new Date(incomingDate);

    return `${Utils().days[date.getDay()].day} ${Utils().months[date.getMonth()].name} ${date.getDate()}, ${date.getFullYear()}`;
  }

  getData(state) {
    // get data
    this.Api.call(ROUTES.getSingleDayData + `?day=${state.day}&month=${state.month}&date=${state.date}&year=${state.year}&dateStr=${state.dateStr}`, "GET")
      .then((response) => {
        console.log("response.data: ", response.data);

        const {oid, forecastGM, forecastCS, actualCS, actualGM, scheduledHours, flexHours, totalForecastHours, totalActualHours} = response.data.singleDayData;
        // can't override whole obj bc this.state already has date info on it
        this.state = Object.assign({}, state, {
          oid,
          forecastGM,
          forecastCS,
          actualCS,
          actualGM,
          scheduledHours,
          flexHours,
          totalForecastHours: this.calculateHours(forecastGM, forecastCS, this.CASES_PER_HOUR),
          totalActualHours: this.calculateHours(actualCS, actualGM, this.CASES_PER_HOUR)
        })
        
        // if submitting again, mark isUpdate
        this.isUpdate = this.state.oid ? true : false;

        console.log("this.state: ", this.state);
        console.log("this.isUpdate: ", this.isUpdate);
      })
      .catch((err) => {
        console.log("err: ", err);
      })
  }

  calculateHours(num1, num2, casesPerHour) {
      return (+num1 + +num2) / casesPerHour;
  }

  
  onChange() {
    this.state.totalForecastHours = this.calculateHours(this.state.forecastCS, this.state.forecastGM, this.CASES_PER_HOUR);
    this.state.totalActualHours = this.calculateHours(this.state.actualCS, this.state.actualGM, this.CASES_PER_HOUR);
  }

  doChecks(data: ITruckData): {errs: Array<string>, isValid: boolean} {
    let errs = [];

    if (this.hasNoValue(data.forecastCS)) errs.push("Don't forget the Forecast C&S")
    if (this.hasNoValue(data.forecastGM)) errs.push("Don't forget the Forecast GM")
    if (this.hasNoValue(data.actualCS)) errs.push("Don't forget the Actual C&S")
    if (this.hasNoValue(data.actualGM)) errs.push("Don't forget the Actual GM")
    if (this.hasNoValue(data.scheduledHours)) errs.push("Don't forget hours scheduled");

    return {errs, isValid: errs.length ? false : true};
  }

  hasNoValue(x) {
    if (x === undefined || x === null || x === "") return true;
    else false;
  }

  submit() {
    let checks = this.doChecks(this.state);

    if (checks.isValid) {
    // submit data
      console.log("this.state: ", this.state);

      this.Api.call(ROUTES.saveSingleDayData, "POST", {
              dateStr: this.state.dateStr, //Utils().toLocalIsoString(this.dateStr), 
              toData: this.state,
              isUpdate: this.isUpdate
        })
        .then((response) => {
          // TODO ALERT HERE
          console.log("response: ", response);
          this.navCtrl.pop();
        })
        .catch((err) => {
          console.log("err: ", err);
        })
    } else {
      let alert = this.alertCtrl.create({
        title: 'Uh Oh!',
        subTitle: 'Missing Fields!',
        message: checks.errs.join("! "),
        buttons: []
      });
      alert.present();
      console.log("checks.errs: ", checks.isValid, checks.errs);
      // TODO    ALERT HERE
    }
  }
}

export interface ITruckData {
  oid: number;
  forecastGM: number;
  forecastCS: number;
  actualCS: number;
  actualGM: number;
  scheduledHours: number;
  flexHours: number;
  totalForecastHours: number;
  totalActualHours: number;
  day: number;
  month: number;
  date: number;
  year: number;
  dateStr: string;
}
