import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersSlideComponent } from './customers-slide.component';

describe('CustomersSlideComponent', () => {
  let component: CustomersSlideComponent;
  let fixture: ComponentFixture<CustomersSlideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersSlideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomersSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
