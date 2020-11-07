import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/lib/api.service';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
import { Injector } from '@angular/core';
import { Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-ban',
  templateUrl: './ban.component.html',
  styleUrls: ['./ban.component.css']
})
export class BanComponent extends BaseComponent implements OnInit {

  public bans: any;
  public ban: any;
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
      'ten_ban': [''],  
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/ban/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.bans = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/ban/search',{page: this.page, pageSize: this.pageSize, ten_ban: this.formsearch.get('ten_ban').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.bans = res.data;
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
           ma_ban:value.ma_ban,
           ma_dat:value.ma_dat,
           ma_kv:value.ma_kv,
           ten_ban:value.ten_ban,
           so_ghe:value.so_ghe        
          };
        this._api.post('/api/ban/create-ban',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
    } else { 
      //this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        //let data_image = data == '' ? null : data;
        let tmp = {
           //image_url:data_image,
           ma_dat:value.ma_dat,
           ma_kv:value.ma_kv,
           ten_ban:value.ten_ban,
           so_ghe:value.so_ghe,
           ma_ban:this.ban.ma_ban,         
          };
        this._api.post('/api/ban/update-ban',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          }); 
    }
   
  } 
  onDelete(row) { 
    this._api.post('/api/ban/delete-ban',{ma_ban:row.ma_ban}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.ban = null;
    this.formdata = this.fb.group({
        'ma_ban': ['', Validators.required],
        'ma_dat': ['', Validators.required],
        'ma_kv': ['', Validators.required],
        'ten_ban': ['', Validators.required],
        'so_ghe': ['', Validators.required],
    }, {
      //validator: MustMatch('matkhau', 'nhaplaimatkhau')
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.ban = null;
    setTimeout(() => {
      $('#createBanModal').modal('toggle');
      this.formdata = this.fb.group({
        'ma_ban': ['', Validators.required],
        'ma_dat': ['', Validators.required],
        'ma_kv': ['', Validators.required],
        'ten_ban': ['', Validators.required],
        'so_ghe': ['', Validators.required],
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
      $('#createBanModal').modal('toggle');
      this._api.get('/api/ban/get-by-id/'+ row.ma_ban).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.ban = res; 
        //let ngaysinh = new Date(this.loaimon.ngaysinh);
          this.formdata = this.fb.group({
            'ma_ban': [this.ban.ma_ban, Validators.required],
            'ma_dat': [this.ban.ma_dat, Validators.required],
            'ma_kv': [this.ban.ma_kv, Validators.required],
            'ten_ban': [this.ban.ten_ban, Validators.required],
            'so_ghe': [this.ban.so_ghe, Validators.required],
          }, {
            //validator: MustMatch('matkhau', 'nhaplaimatkhau')
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }
  
  closeModal() {
    $('#createBanModal').closest('.modal').modal('hide');
  }
}



