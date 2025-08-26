import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutDeveloperPage } from './about-developer.page';

describe('AboutDeveloperPage', () => {
  let component: AboutDeveloperPage;
  let fixture: ComponentFixture<AboutDeveloperPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AboutDeveloperPage],
    });
    fixture = TestBed.createComponent(AboutDeveloperPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
