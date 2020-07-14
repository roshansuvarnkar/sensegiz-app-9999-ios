import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeviceScanPage } from './device-scan.page';

describe('DeviceScanPage', () => {
  let component: DeviceScanPage;
  let fixture: ComponentFixture<DeviceScanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceScanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceScanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
