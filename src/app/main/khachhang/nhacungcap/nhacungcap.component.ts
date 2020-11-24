import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-nhacungcap',
  templateUrl: './nhacungcap.component.html',
  styleUrls: ['./nhacungcap.component.css'],
})
export class NhacungcapComponent extends BaseComponent implements OnInit {
  public nhacungcaps: any;
  public nhacungcap: any;
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
      'ten_ncc': [''],    
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/nhacungcap/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.nhacungcaps = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/nhacungcap/search',{page: this.page, pageSize: this.pageSize, ten_ncc: this.formsearch.get('ten_ncc').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.nhacungcaps = res.data;
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
           ten_ncc:value.ten_ncc,
           dia_chi:value.dia_chi,
           sdt:value.sdt       
          };
        this._api.post('/api/nhacungcap/create-ncc',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
    } else { 
        let tmp = { 
           ten_ncc:value.ten_ncc,
           dia_chi:value.dia_chi,
           sdt:value.sdt, 
           ma_ncc:this.nhacungcap.ma_ncc,          
          };
        this._api.post('/api/nhacungcap/update-ncc',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/nhacungcap/delete-ncc',{ma_ncc:row.ma_ncc}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.nhacungcap = null;
    this.formdata = this.fb.group({
      'ten_ncc': ['', Validators.required],
      'dia_chi': ['', Validators.required],
      'sdt': ['', Validators.required],
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.nhacungcap = null;
    setTimeout(() => {
      $('#createNhacungcapModal').modal('toggle');
      this.formdata = this.fb.group({
        'ten_ncc': ['', Validators.required],
        'dia_chi': ['', Validators.required],
        'sdt': ['', Validators.required],
      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createNhacungcapModal').modal('toggle');
      this._api.get('/api/nhacungcap/get-by-id/'+ row.ma_ncc).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.nhacungcap = res; 
          this.formdata = this.fb.group({
            'ma_ncc': [this.nhacungcap.ma_ncc, Validators.required],
            'ten_ncc': [this.nhacungcap.ten_ncc, Validators.required],
            'dia_chi': [this.nhacungcap.dia_chi, Validators.required],
            'sdt': [this.nhacungcap.sdt, Validators.required],
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createNhacungcapModal').closest('.modal').modal('hide');
  }
}
