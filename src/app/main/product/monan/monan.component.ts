import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/lib/api.service';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
import { Injector } from '@angular/core';
import { Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-monan',
  templateUrl: './monan.component.html',
  styleUrls: ['./monan.component.css']
})
export class MonanComponent extends BaseComponent implements OnInit {

  public monans: any;
  public monan: any;
  public product:any;
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
      'ten_mon': [''],  
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/monan/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.monans = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/monan/search',{page: this.page, pageSize: this.pageSize, ten_mon: this.formsearch.get('ten_mon').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.monans = res.data;
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
  
  get f() { return this.formdata.controls; }
  
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
           ma_loai:value.ma_loai,
           ten_mon:value.ten_mon,
           hinh_anh:value.hinh_anh,
           gia:value.gia          
          };
        this._api.post('/api/monan/create-monan',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
    } else { 
      //this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        //let data_image = data == '' ? null : data;
        let tmp = {
           //image_url:data_image,
           ma_loai:value.ma_loai,
           ten_mon:value.ten_mon,
           hinh_anh:value.hinh_anh,
           gia:value.gia,   
           ma_mon:this.monan.ma_mon,         
          };
        this._api.post('/api/monan/update-monan',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          }); 
    }
   
  } 
  onDelete(row) { 
    this._api.post('/api/monan/delete-monan',{ma_mon:row.ma_mon}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.monan = null;
    this.formdata = this.fb.group({
        'ma_loai': ['', Validators.required],
        'ten_mon': ['', Validators.required],
        'hinh_anh': ['', Validators.required],
        'gia': ['', Validators.required],
    }, {
      //validator: MustMatch('matkhau', 'nhaplaimatkhau')
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.monan = null;
    setTimeout(() => {
      $('#createmonanModal').modal('toggle');
      this.formdata = this.fb.group({
        'ma_mon': ['', Validators.required],
        'ma_loai': ['', Validators.required],
        'ten_mon': ['', Validators.required],
        'hinh_anh': ['', Validators.required],
        'gia': ['', Validators.required],
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
      $('#createmonanModal').modal('toggle');
      this._api.get('/api/monan/get-by-id/'+ row.ma_mon).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.monan = res; 
        //let ngaysinh = new Date(this.loaimon.ngaysinh);
          this.formdata = this.fb.group({
            'ma_mon': [this.monan.ma_mon, Validators.required],
            'ma_loai': [this.monan.ma_loai, Validators.required],
            'ten_mon': [this.monan.ten_mon, Validators.required],
            'hinh_anh': [this.monan.hinh_anh, Validators.required],
            'gia': [this.monan.gia, Validators.required],
          }, {
            //validator: MustMatch('matkhau', 'nhaplaimatkhau')
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }
  
  closeModal() {
    $('#createmonanModal').closest('.modal').modal('hide');
  }
}



