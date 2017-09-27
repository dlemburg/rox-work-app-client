import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TruckDataPage } from './truck-data';

@NgModule({
  declarations: [
    TruckDataPage,
  ],
  imports: [
    IonicPageModule.forChild(TruckDataPage),
  ],
})
export class TruckDataPageModule {}
