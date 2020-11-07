import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/lib/api.service';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
import { Injector } from '@angular/core';
import { Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-nhanvien',
  templateUrl: './nhanvien.component.html',
  styleUrls: ['./nhanvien.component.css']
})
export class NhanvienComponent extends BaseComponent implements OnInit {

  public nhanviens: any;
  public nhanvien: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  submitted = false;
  //@ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector, private service:ApiService) {
    super(injector);
  }
  
  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'ten_nv': [''],  
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/nhanvien/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.nhanviens = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/nhanvien/search',{page: this.page, pageSize: this.pageSize, ten_nv: this.formsearch.get('ten_nv').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.nhanviens = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  }

  pwdCheckValidator(control){
    var filteredStrings = {search:control.value, select:'@#!$%&*'}
    var result = (filteredStrings.select.match(new RegExp('[' + filteredStrings.search + ']', 'g')) || []).join('');
    if(control.value.length < 6 || !result){
        return {matkhau: true};
    }
  }
  
  onSubmit(value) {
    this.submitted = true;
    if (this.formdata.invalid) {
      return;
    } 
    if(this.isCreate) { 
      //this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
      //let data_image = data == '' ? null : data;
        let tmp = {
           //image_url:data_image,
           //ma_mon:value.ma_mon,
           ma_nv:value.ma_nv,
           ma_cv:value.ma_cv,
           ten_nv:value.ten_nv,
           gioi_tinh:value.gioi_tinh,
           ngay_sinh:value.ngay_sinh,
           dia_chi:value.dia_chi,
           sdt:value.sdt          
          };
        this._api.post('/api/nhanvien/create-nhanvien',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
    } else { 
      //this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        //let data_image = data == '' ? null : data;
        let tmp = {
           //image_url:data_image,
           ma_cv:value.ma_cv,
           ten_nv:value.ten_nv,
           gioi_tinh:value.gioi_tinh,
           ngay_sinh:value.ngay_sinh,
           dia_chi:value.dia_chi,
           sdt:value.sdt,   
           ma_nv:this.nhanvien.ma_nv,         
          };
        this._api.post('/api/nhanvien/update-nhanvien',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          }); 
    }
   
  } 
  onDelete(row) { 
    this._api.post('/api/nhanvien/delete-nhanvien',{ma_nv:row.ma_nv}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.nhanvien = null;
    this.formdata = this.fb.group({
        'ma_cv': ['', Validators.required],
        'ten_nv': ['', Validators.required],
        'gioi_tinh': ['', Validators.required],
        'ngay_sinh': ['', Validators.required],
        'dia_chi': ['', Validators.required],
        'sdt': ['', Validators.required],
    }, {
      //validator: MustMatch('matkhau', 'nhaplaimatkhau')
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.nhanvien = null;
    setTimeout(() => {
      $('#createNhanvienModal').modal('toggle');
      this.formdata = this.fb.group({
        'ma_nv': ['', Validators.required],
        'ma_cv': ['', Validators.required],
        'ten_nv': ['', Validators.required],
        'gioi_tinh': ['', Validators.required],
        'ngay_sinh': ['', Validators.required],
        'dia_chi': ['', Validators.required],
        'sdt': ['', Validators.required],
      }, {
        //validator: MustMatch('matkhau', 'nhaplaimatkhau')
      });
      // this.formdata.get('ngaysinh').setValue(this.today);
      // this.formdata.get('gioitinh').setValue(this.genders[0].value); 
      // this.formdata.get('role').setValue(this.roles[0].value);
      this.doneSetupForm = true;
    });
    
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createNhanvienModal').modal('toggle');
      this._api.get('/api/nhanvien/get-by-id/'+ row.ma_nv).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.nhanvien = res; 
        //let ngaysinh = new Date(this.loaimon.ngaysinh);
          this.formdata = this.fb.group({
            'ma_nv': [this.nhanvien.ma_nv, Validators.required],
            'ma_cv': [this.nhanvien.ma_cv, Validators.required],
            'ten_nv': [this.nhanvien.ten_nv, Validators.required],
            'gioi_tinh': [this.nhanvien.gioi_tinh, Validators.required],
            'ngay_sinh': [this.nhanvien.ngay_sinh, Validators.required],
            'dia_chi': [this.nhanvien.dia_chi, Validators.required],
            'sdt': [this.nhanvien.sdt, Validators.required],
          }, {
            //validator: MustMatch('matkhau', 'nhaplaimatkhau')
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }
  
  closeModal() {
    $('#createNhanvienModal').closest('.modal').modal('hide');
  }
}



