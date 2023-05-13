import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseTilesComponent } from './course-tiles-sidenav.component';

describe('CourseTilesComponent', () => {
  let component: CourseTilesComponent;
  let fixture: ComponentFixture<CourseTilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseTilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
