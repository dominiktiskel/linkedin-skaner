import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LeaderDetailComponent } from './leader-detail.component';

describe('Leader Management Detail Component', () => {
  let comp: LeaderDetailComponent;
  let fixture: ComponentFixture<LeaderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaderDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ leader: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LeaderDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LeaderDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load leader on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.leader).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
