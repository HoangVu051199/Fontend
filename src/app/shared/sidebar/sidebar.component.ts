import { Component, OnInit, AfterViewInit } from '@angular/core';
declare let $: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit {
  public menus = [
  {name :'Người dùng', url:'',icon:'user',childs:[{name:'Quản lý người dùng',url:'user/user'},{name:'Đăng xuất', url:''},{name:'Đăng nhập', url:'/login'}]},
  {name:'Danh mục',url:'',icon:'reorder',childs:[{name:'Quản lý loại món',url:'/product/loaimon'},{name:'Quản lý món ăn',url:'/product/monan'},{name:'Quản lý nhân viên',url:'/product/nhanvien'}]},
  {name:'Khu vực - Phòng bàn',url:'',icon:'table',childs:[{name:'Quản lý khu vực',url:'/khuvuc/khuvuc'},{name:'Quản lý phòng bàn',url:'/khuvuc/ban'}]},
  {name:'Khách hàng',url:'',icon:'group icon',childs:[{name:'Quản lý khách hàng',url:'/khachhang/khachhang'},{name:'Quản lý nhà cung cấp',url:'/khachhang/nhacungcap'}]}];
  constructor() { } 
  ngOnInit(): void {
  }
  ngAfterViewInit() {
    $('#sidebar-collapse').click(function () {
      setTimeout(() => {
        let event;
        if (typeof (Event) === 'function') {
          event = new Event('resize');
        } else {
          event = document.createEvent('Event');
          event.initEvent('resize', true, true);
        }
        window.dispatchEvent(event);
      }, 100);
      if (!$('#sidebar').hasClass('menu-min')) {
        $('.main-content').css('padding-left', '43px');
        $('.footer-inner').css('left', '43px');
      } else {
        $('.main-content').css('padding-left', '190px');
        $('.footer-inner').css('left', '190px');
      }
    });
    setTimeout(() => {
      let event;
      if (typeof (Event) === 'function') {
        event = new Event('resize');
      } else {
        event = document.createEvent('Event');
        event.initEvent('resize', true, true);
      }
      window.dispatchEvent(event);
    }, 100);
    setTimeout(() => {
      $('.main-content').css('padding-left', $('#sidebar').width() + 1);
      $('.footer-inner').css('left', $('#sidebar').width() + 1);
    }, 100);
  }
}
