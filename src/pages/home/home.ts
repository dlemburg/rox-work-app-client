import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StatisticsPage } from '../statistics/statistics';
import { TruckDataPage } from '../truck-data/truck-data';
import { Api, ROUTES } from '../../utils/api';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  days = Utils().days;
  today = new Date();
  squares = [];
  state = {
    currentMonth: Utils().months[this.today.getMonth()],
    currentYear: this.today.getFullYear(),
    currentMonthNumberOfDays: Utils().months[this.today.getMonth()].days,
    firstDayOfMonth: new Date(this.today.getFullYear(), this.today.getMonth(), 1).getDay()
  };
  csTruckDays = [1, 2, 4, 6];
  initHasRun = false;


  //squares = Array(42).fill(null).map((x, i) => i + 1);   // 6 rows of 7 days

  constructor(public navCtrl: NavController, private Api: Api) {
    
  }

  ionViewDidLoad() {

    this.getMonthData(this.state);
  }

  ionViewDidEnter() {
    if (this.initHasRun) this.getMonthData(this.state);
    else this.initHasRun = true;
  }

  getMonthData(state) {
    // get data
    this.squares = this.buildSquares(state.firstDayOfMonth, state.currentMonthNumberOfDays);


    this.Api.call(ROUTES.getMonthData + `?month=${state.currentMonth.month}&year=${state.currentYear}`, "GET")
      .then((response) => {
        console.log("response.data: ", response.data);
        let monthData = response.data.monthData;

        this.squares = this.injectSquaresWithData(this.squares, monthData);
      })
      .catch((err) => {
        console.log("err: ", err);
      })
    
  }

  buildSquares(firstDayOfMonth: number, currentMonthNumberOfDays: number) {
    let arr = [];
    let dateCounter = 1; // only increments once first day hit
   // let offByCounter = 0;

    for (let i = 0; i < 42; i++) {
      
      // fill first squares w/ null if not first day of month
      if (i < firstDayOfMonth) arr = [...arr, null];
      
      // fill with null if greater than month days
      else if ((i - firstDayOfMonth) >= currentMonthNumberOfDays) arr = [...arr, null];

      // fill with data with obj
      else {
        arr = [...arr, {
          date: dateCounter || null, 
          efficiency: null,
          forecastHours: null,
          totalHours: null,
          dateStr: Utils().toLocalIsoString(new Date().toString()),
          oid: null
        }];
        dateCounter += 1;
     }
    }
    return arr;
  }

  injectSquaresWithData(squares, monthData: Array<IMonthData>) {
    let newSquares = squares.map((x) => {
      if (x === null) return x;
      else {
        let data = monthData.find((y) => {
          return x.date === y.date; 
        });

        return data ? data : x;
      }
    });

    return newSquares;
  }

  isActive(x: IMonthData) {
    if (x === null) return false;
    else {
      return (this.today.getMonth() === this.state.currentMonth.month 
        && this.today.getFullYear() === this.state.currentYear
        && this.today.getDate() === x.date)
      ? true
      : false
    }
  }

  isCSTruck(x): boolean {
    if (x === null) return false;
    else {
      let date = this.buildDate(this.state.currentYear, this.state.currentMonth.month, x);
      
      if (this.csTruckDays.indexOf(date.getDay()) > -1) return true;
      else return false;
    }
  }

  isGreen(x) {
    return Math.abs(x) < 5;
  }

  buildDate(year, month, day): Date {
    return new Date(year, month, day);
  }

  changeMonth(addOrSubtract): void {
    let currentYear = this.state.currentYear;
    let newMonth = null;
    let newYear = null;

    // add
    if (addOrSubtract === "add") {
      // December -> January
      if (this.state.currentMonth.month === 11) {
        newMonth = 0;
        newYear = this.state.currentYear + 1;
      }
      // everything else
      else {
        newMonth = this.state.currentMonth.month + 1;
        newYear = this.state.currentYear;
      }
    } 

    // subtract
    else if (addOrSubtract === "subtract") {
      // January -> December
      if (this.state.currentMonth.month === 0) {
        newMonth = 11;
        newYear = this.state.currentYear - 1;
      }
      // everything else
      else {
        newMonth = this.state.currentMonth.month - 1;
        newYear = this.state.currentYear;
      }
    }

    // DO WORK HERE

    this.state = {
      currentMonth: Utils().months[newMonth],
      currentYear: newYear,
      currentMonthNumberOfDays: Utils().months[newMonth].days,
      firstDayOfMonth: new Date(newYear, newMonth, 1).getDay()
    };
   // this.squares = this.buildSquares(this.state.firstDayOfMonth, this.state.currentMonthNumberOfDays, this.monthData);

    this.getMonthData(this.state);
  }

  // x is the date 1-31 that was clicked on
  navDate(x: IMonthData) {
    if (x === null) return;

    let date = new Date(this.state.currentYear, this.state.currentMonth.month, x.date);
    this.navCtrl.push(TruckDataPage, {date})
  }

}


  /*
  isDaySquare(index, square) {
    return (index >= this.state.firstDayOfMonth) && !(square - this.state.firstDayOfMonth > this.state.currentMonth.days);
  }

  isGraySquare(index, square) {
    return !(index >= this.state.firstDayOfMonth) || (square - this.state.firstDayOfMonth > this.state.currentMonth.days)
  }
  */


interface IMonthData {
  efficiency: number;
  date: number;
  forecastHours: number;
  actualHours: number;
  oid: number;
  dateStr: string;
}
