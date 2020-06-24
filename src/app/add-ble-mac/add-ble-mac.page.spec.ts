import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddBleMacPage } from './add-ble-mac.page';

describe('AddBleMacPage', () => {
  let component: AddBleMacPage;
  let fixture: ComponentFixture<AddBleMacPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBleMacPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddBleMacPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
