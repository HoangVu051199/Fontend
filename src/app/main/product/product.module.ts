import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoaimonComponent } from './loaimon/loaimon.component';
import { MonanComponent } from './monan/monan.component';
import { NhanvienComponent } from './nhanvien/nhanvien.component';

@NgModule({
  declarations: [ 
   LoaimonComponent, MonanComponent, NhanvienComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'loaimon',
        component: LoaimonComponent,
      },
      {
        path: 'monan',
        component: MonanComponent,
      },
      {
        path: 'nhanvien',
        component: NhanvienComponent,
      },
  ]),  
  ]
})
export class ProductModule { }
