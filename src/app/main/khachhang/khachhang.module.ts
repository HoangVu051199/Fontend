import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { KhachhangComponent } from './khachhang/khachhang.component';
import { NhacungcapComponent } from './nhacungcap/nhacungcap.component';


@NgModule({
  declarations: [ 
    KhachhangComponent, NhacungcapComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'khachhang',
        component: KhachhangComponent,
      },
      {
        path: 'nhacungcap',
        component: NhacungcapComponent,
      },
  ]),  
  ]
})
export class KhachhangModule { }
