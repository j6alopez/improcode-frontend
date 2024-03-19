import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantsListPageComponent } from './participants-list-page.component';

describe('ParticipantsListPageComponent', () => {
  let component: ParticipantsListPageComponent;
  let fixture: ComponentFixture<ParticipantsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantsListPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticipantsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
