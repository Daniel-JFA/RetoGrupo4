import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphCircleComponent } from './graph-circle.component';

describe('GraphCircleComponent', () => {
  let component: GraphCircleComponent;
  let fixture: ComponentFixture<GraphCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphCircleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraphCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
