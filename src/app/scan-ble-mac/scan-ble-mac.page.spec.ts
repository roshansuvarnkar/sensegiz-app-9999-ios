import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScanBleMacPage } from './scan-ble-mac.page';

describe('ScanBleMacPage', () => {
  let component: ScanBleMacPage;
  let fixture: ComponentFixture<ScanBleMacPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanBleMacPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScanBleMacPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
