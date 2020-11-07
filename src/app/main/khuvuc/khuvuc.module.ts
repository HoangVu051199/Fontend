import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { BanComponent } from './ban/ban.component';
import { KhuvucComponent } from './khuvuc/khuvuc.component';

@NgModule({
  declarations: [ 
    KhuvucComponent, BanComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'khuvuc',
        component: KhuvucComponent,
      },
      {
        path: 'ban',
        component: BanComponent,
      },
  ]),  
  ]
})
export class KhuvucModule { }
