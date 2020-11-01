import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/lib/api.service';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
import { Injector } from '@angular/core';
import { Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-loaimon',
  templateUrl: './loaimon.component.html',
  styleUrls: ['./loaimon.component.css']
})
export class LoaimonComponent extends BaseComponent implements OnInit {

  public loaimons: any;
  public loaimon: any;
  public ProductList: any=[];
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
    this.refserProList();
  }
  refserProList(){
    this.service.get("/api/Loaimon/get-all").subscribe(data=>{
      this.ProductList = data;
    });
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
           ma_loai:value.ma_loai,
           ten_loai:value.ten_loai          
          };
        this._api.post('/api/Loaimon/create-loai',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          //this.search();
          this.closeModal();
          });
    } else { 
      //this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        //let data_image = data == '' ? null : data;
        let tmp = {
           //image_url:data_image,
           ma_loai:value.ma_loai,
           ten_loai:value.ten_loai          
          };
        this._api.post('/api/Loaimon/update-loaimon',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          //this.search();
          this.closeModal();
          }); 
    }
   
  } 
  onDelete(row) { 
    this._api.post('/api/Loaimon/delete-loai',{Ma_loai:row.Ma_loai}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      //this.search(); 
      });
  }
  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.loaimon = null;
    setTimeout(() => {
      $('#createloaimonModal').modal('toggle');
      this.formdata = this.fb.group({
        'ma_loai': ['', Validators.required],
        'ten_loai': ['', Validators.required],
        // 'ngaysinh': ['', Validators.required],
        // 'diachi': [''],
        // 'gioitinh': ['', Validators.required],
        // 'email': ['', [Validators.required,Validators.email]],
        // 'taikhoan': ['', Validators.required],
        // 'matkhau': ['', [this.pwdCheckValidator]],
        // 'nhaplaimatkhau': ['', Validators.required],
        // 'role': ['', Validators.required],
      }, {
        //validator: MustMatch('matkhau', 'nhaplaimatkhau')
      });
      // this.formdata.get('ngaysinh').setValue(this.today);
      // this.formdata.get('gioitinh').setValue(this.genders[0].value); 
      // this.formdata.get('role').setValue(this.roles[0].value);
      this.doneSetupForm = true;
    });
    
  }
  
  closeModal() {
    $('#createloaimonModal').closest('.modal').modal('hide');
  }
}



