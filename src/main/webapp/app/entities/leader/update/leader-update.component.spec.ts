import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LeaderService } from '../service/leader.service';
import { ILeader, Leader } from '../leader.model';

import { LeaderUpdateComponent } from './leader-update.component';

describe('Leader Management Update Component', () => {
  let comp: LeaderUpdateComponent;
  let fixture: ComponentFixture<LeaderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let leaderService: LeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LeaderUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(LeaderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LeaderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    leaderService = TestBed.inject(LeaderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const leader: ILeader = { id: 456 };

      activatedRoute.data = of({ leader });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(leader));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Leader>>();
      const leader = { id: 123 };
      jest.spyOn(leaderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leader });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: leader }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(leaderService.update).toHaveBeenCalledWith(leader);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Leader>>();
      const leader = new Leader();
      jest.spyOn(leaderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leader });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: leader }));
      saveSubject.complete();

      // THEN
      expect(leaderService.create).toHaveBeenCalledWith(leader);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Leader>>();
      const leader = { id: 123 };
      jest.spyOn(leaderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leader });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(leaderService.update).toHaveBeenCalledWith(leader);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
