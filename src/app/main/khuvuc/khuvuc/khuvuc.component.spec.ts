import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhuvucComponent } from './khuvuc.component';

describe('KhuvucComponent', () => {
  let component: KhuvucComponent;
  let fixture: ComponentFixture<KhuvucComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvucComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
