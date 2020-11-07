import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-khachhang',
  templateUrl: './khachhang.component.html',
  styleUrls: ['./khachhang.component.css'],
})
export class KhachhangComponent extends BaseComponent implements OnInit {
  public khachhangs: any;
  public khachhang: any;
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
      'ten_kh': [''],    
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/khachhang/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.khachhangs = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/khachhang/search',{page: this.page, pageSize: this.pageSize, ten_kh: this.formsearch.get('ten_kh').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.khachhangs = res.data;
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
           ma_kh:value.ma_kh, 
           ten_kh:value.ten_kh,
           dia_chi:value.dia_chi,
           sdt:value.sdt       
          };
        this._api.post('/api/khachhang/create-khachhang',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
    } else { 
      //this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        //let data_image = data == '' ? null : data;
        let tmp = { 
           ten_kh:value.ten_kh,
           dia_chi:value.dia_chi,
           sdt:value.sdt, 
           ma_kh:this.khachhang.ma_kh,          
          };
        this._api.post('/api/khachhang/update-khachhang',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/khachhang/delete-khachhang',{ma_kh:row.ma_kh}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.khachhang = null;
    this.formdata = this.fb.group({
      'ten_kh': ['', Validators.required],
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
    this.khachhang = null;
    setTimeout(() => {
      $('#createKhachhangModal').modal('toggle');
      this.formdata = this.fb.group({
        'ma_kh': ['', Validators.required],
        'ten_kh': ['', Validators.required],
        'dia_chi': ['', Validators.required],
        'sdt': ['', Validators.required],
      }, {
        //validator: MustMatch('matkhau', 'nhaplaimatkhau')
      });
      //this.formdata.get('ngaysinh').setValue(this.today);
      //this.formdata.get('gioitinh').setValue(this.genders[0].value); 
      //this.formdata.get('role').setValue(this.roles[0].value);
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createKhachhangModal').modal('toggle');
      this._api.get('/api/khachhang/get-by-id/'+ row.ma_kh).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.khachhang = res; 
        //let ngaysinh = new Date(this.user.ngaysinh);
          this.formdata = this.fb.group({
            'ma_kh': [this.khachhang.ma_kh, Validators.required],
            'ten_kh': [this.khachhang.ten_kh, Validators.required],
            'dia_chi': [this.khachhang.dia_chi, Validators.required],
            'sdt': [this.khachhang.sdt, Validators.required],
          }, {
            //validator: MustMatch('matkhau', 'nhaplaimatkhau')
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createKhachhangModal').closest('.modal').modal('hide');
  }
}
