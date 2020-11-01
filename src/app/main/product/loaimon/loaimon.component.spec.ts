import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaimonComponent } from './loaimon.component';

describe('LoaimonComponent', () => {
  let component: LoaimonComponent;
  let fixture: ComponentFixture<LoaimonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaimonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaimonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
