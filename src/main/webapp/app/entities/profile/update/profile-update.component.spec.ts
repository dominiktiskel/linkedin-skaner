import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProfileService } from '../service/profile.service';
import { IProfile, Profile } from '../profile.model';
import { ILeader } from 'app/entities/leader/leader.model';
import { LeaderService } from 'app/entities/leader/service/leader.service';
import { ICampaign } from 'app/entities/campaign/campaign.model';
import { CampaignService } from 'app/entities/campaign/service/campaign.service';

import { ProfileUpdateComponent } from './profile-update.component';

describe('Profile Management Update Component', () => {
  let comp: ProfileUpdateComponent;
  let fixture: ComponentFixture<ProfileUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let profileService: ProfileService;
  let leaderService: LeaderService;
  let campaignService: CampaignService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProfileUpdateComponent],
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
      .overrideTemplate(ProfileUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProfileUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    profileService = TestBed.inject(ProfileService);
    leaderService = TestBed.inject(LeaderService);
    campaignService = TestBed.inject(CampaignService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Leader query and add missing value', () => {
      const profile: IProfile = { id: 456 };
      const leader: ILeader = { id: 61446 };
      profile.leader = leader;

      const leaderCollection: ILeader[] = [{ id: 65178 }];
      jest.spyOn(leaderService, 'query').mockReturnValue(of(new HttpResponse({ body: leaderCollection })));
      const additionalLeaders = [leader];
      const expectedCollection: ILeader[] = [...additionalLeaders, ...leaderCollection];
      jest.spyOn(leaderService, 'addLeaderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ profile });
      comp.ngOnInit();

      expect(leaderService.query).toHaveBeenCalled();
      expect(leaderService.addLeaderToCollectionIfMissing).toHaveBeenCalledWith(leaderCollection, ...additionalLeaders);
      expect(comp.leadersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Campaign query and add missing value', () => {
      const profile: IProfile = { id: 456 };
      const comapigns: ICampaign[] = [{ id: 90674 }];
      profile.comapigns = comapigns;

      const campaignCollection: ICampaign[] = [{ id: 27168 }];
      jest.spyOn(campaignService, 'query').mockReturnValue(of(new HttpResponse({ body: campaignCollection })));
      const additionalCampaigns = [...comapigns];
      const expectedCollection: ICampaign[] = [...additionalCampaigns, ...campaignCollection];
      jest.spyOn(campaignService, 'addCampaignToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ profile });
      comp.ngOnInit();

      expect(campaignService.query).toHaveBeenCalled();
      expect(campaignService.addCampaignToCollectionIfMissing).toHaveBeenCalledWith(campaignCollection, ...additionalCampaigns);
      expect(comp.campaignsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const profile: IProfile = { id: 456 };
      const leader: ILeader = { id: 77092 };
      profile.leader = leader;
      const comapigns: ICampaign = { id: 59963 };
      profile.comapigns = [comapigns];

      activatedRoute.data = of({ profile });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(profile));
      expect(comp.leadersSharedCollection).toContain(leader);
      expect(comp.campaignsSharedCollection).toContain(comapigns);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Profile>>();
      const profile = { id: 123 };
      jest.spyOn(profileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: profile }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(profileService.update).toHaveBeenCalledWith(profile);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Profile>>();
      const profile = new Profile();
      jest.spyOn(profileService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: profile }));
      saveSubject.complete();

      // THEN
      expect(profileService.create).toHaveBeenCalledWith(profile);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Profile>>();
      const profile = { id: 123 };
      jest.spyOn(profileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(profileService.update).toHaveBeenCalledWith(profile);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackLeaderById', () => {
      it('Should return tracked Leader primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLeaderById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackCampaignById', () => {
      it('Should return tracked Campaign primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCampaignById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedCampaign', () => {
      it('Should return option if no Campaign is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedCampaign(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Campaign for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedCampaign(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Campaign is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedCampaign(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
