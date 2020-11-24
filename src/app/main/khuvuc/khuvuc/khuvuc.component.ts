import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-khuvuc',
  templateUrl: './khuvuc.component.html',
  styleUrls: ['./khuvuc.component.css'],
})
export class KhuvucComponent extends BaseComponent implements OnInit {
  public khuvucs: any;
  public khuvuc: any;
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
      'ten_kv': [''],    
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/khuvuc/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.khuvucs = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/khuvuc/search',{page: this.page, pageSize: this.pageSize, ten_kv: this.formsearch.get('ten_kv').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.khuvucs = res.data;
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
        let tmp = {
           ten_kv:value.ten_kv,       
          };
        this._api.post('/api/khuvuc/create-khuvuc',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
    } else { 
        let tmp = {
          ten_kv:value.ten_kv,
           ma_kv:this.khuvuc.ma_kv,          
          };
        this._api.post('/api/khuvuc/update-khuvuc',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/khuvuc/delete-khuvuc',{ma_kv:row.ma_kv}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.khuvuc = null;
    this.formdata = this.fb.group({
      'ten_kv': ['', Validators.required],
    }, {
      //validator: MustMatch('matkhau', 'nhaplaimatkhau')
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.khuvuc = null;
    setTimeout(() => {
      $('#createKhuvucModal').modal('toggle');
      this.formdata = this.fb.group({
        'ten_kv': ['', Validators.required],
      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createKhuvucModal').modal('toggle');
      this._api.get('/api/khuvuc/get-by-id/'+ row.ma_kv).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.khuvuc = res; 
          this.formdata = this.fb.group({
            'ma_kv': [this.khuvuc.ma_kv, Validators.required],
            'ten_kv': [this.khuvuc.ten_kv, Validators.required],
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createKhuvucModal').closest('.modal').modal('hide');
  }
}
