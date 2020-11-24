import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder,  Validators } from '@angular/forms';
//import { ApiService } from 'src/app/lib/api.service';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;

@Component({
  selector: 'app-monan',
  templateUrl: './monan.component.html',
  styleUrls: ['./monan.component.css']
})
export class MonanComponent extends BaseComponent implements OnInit {

  public monans: any;
  public monan: any;
  public loaimon: any;
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
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }
  
  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'ten_mon': [''],  
    });
    
   this.search();
   this.getcat();
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
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
           hinh_anh:data_image,
           ma_loai:value.ma_loai,
           ten_mon:value.ten_mon,
           gia:value.gia          
          };
        this._api.post('/api/monan/create-monan',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
        });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
           hinh_anh:data_image,
           ma_loai:value.ma_loai,
           ten_mon:value.ten_mon,
           gia:value.gia,   
           ma_mon:this.monan.ma_mon,         
          };
        this._api.post('/api/monan/update-monan',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          }); 
        });
    }
  } 
  onDelete(row) { 
    console.log(this._api);
    this._api.post('/api/monan/delete-monan',{ma_mon:row.ma_mon}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }
  
  getcat() {
    this._api.get('/api/loai/get-all').takeUntil(this.unsubscribe).subscribe(res => {
      this.loaimon = res;
      });
  }

  Reset() {  
    this.monan = null;
    this.formdata = this.fb.group({
        'ma_loai': ['', Validators.required],
        'ten_mon': ['', Validators.required],
        'hinh_anh': ['', Validators.required],
        'gia': ['', Validators.required],
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
        'ma_loai': ['', Validators.required],
        'ten_mon': ['', Validators.required],
        'gia': ['', Validators.required],
      });
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
          this.formdata = this.fb.group({
            'ma_loai': [this.monan.ma_loai, Validators.required],
            'ten_mon': [this.monan.ten_mon, Validators.required],
            'gia': [this.monan.gia, Validators.required],
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }
  
  closeModal() {
    $('#createmonanModal').closest('.modal').modal('hide');
  }
}



