import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ToastrModule } from 'ngx-toastr';
import { TimeagoModule } from "ngx-timeago";
import { CountdownModule } from 'ngx-countdown';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    ToastrModule.forRoot({
      positionClass : 'toast-bottom-right'
    }),
    TimeagoModule.forRoot(),
    CountdownModule
  ],
  exports : [
    TabsModule,
    ToastrModule,
    TimeagoModule,
    CountdownModule
  ]
})
export class SharedModule { }