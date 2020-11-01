import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { ProductComponent } from './product/product.component';
import { TypeComponent } from './type/type.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoaimonComponent } from './loaimon/loaimon.component';
import { MonanComponent } from './monan/monan.component';

@NgModule({
  declarations: [ 
    OrderComponent,ProductComponent,TypeComponent, LoaimonComponent, MonanComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'order',
        component: OrderComponent,
      },
      {
        path: 'product',
        component: ProductComponent,
      },
      {
        path: 'type',
        component: TypeComponent,
      },
      {
        path: 'loaimon',
        component: LoaimonComponent,
      },
  ]),  
  ]
})
export class ProductModule { }
