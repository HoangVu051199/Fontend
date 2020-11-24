import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-loaimon',
  templateUrl: './loaimon.component.html',
  styleUrls: ['./loaimon.component.css'],
})
export class LoaimonComponent extends BaseComponent implements OnInit {
  public loaimons: any;
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
      'ten_loai': [''],    
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/loai/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.loaimons = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/loai/search',{page: this.page, pageSize: this.pageSize, ten_loai: this.formsearch.get('ten_loai').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.loaimons = res.data;
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
           ten_loai:value.ten_loai,       
          };
        this._api.post('/api/loai/create-loai',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
    } else { 
        let tmp = {
          ten_loai:value.ten_loai,
           ma_loai:this.loaimon.ma_loai,          
          };
        this._api.post('/api/loai/update-loai',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/loai/delete-loai',{ma_loai:row.ma_loai}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.loaimon = null;
    this.formdata = this.fb.group({
      'ten_loai': ['', Validators.required],
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.loaimon = null;
    setTimeout(() => {
      $('#createLoaimonModal').modal('toggle');
      this.formdata = this.fb.group({
        'ten_loai': ['', Validators.required],
      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createLoaimonModal').modal('toggle');
      this._api.get('/api/loai/get-by-id/'+ row.ma_loai).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.loaimon = res; 
          this.formdata = this.fb.group({
            'ten_loai': [this.loaimon.ten_loai, Validators.required],
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createLoaimonModal').closest('.modal').modal('hide');
  }
}
