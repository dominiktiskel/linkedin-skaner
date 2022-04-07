import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IProfile, Profile } from '../profile.model';
import { ProfileService } from '../service/profile.service';
import { ILeader } from 'app/entities/leader/leader.model';
import { LeaderService } from 'app/entities/leader/service/leader.service';
import { ICampaign } from 'app/entities/campaign/campaign.model';
import { CampaignService } from 'app/entities/campaign/service/campaign.service';

@Component({
  selector: 'jhi-profile-update',
  templateUrl: './profile-update.component.html',
})
export class ProfileUpdateComponent implements OnInit {
  isSaving = false;

  leadersSharedCollection: ILeader[] = [];
  campaignsSharedCollection: ICampaign[] = [];

  editForm = this.fb.group({
    id: [],
    url: [null, [Validators.required, Validators.maxLength(2000)]],
    businessTarget: [null, [Validators.required]],
    targetWords: [null, [Validators.maxLength(2000)]],
    blockedWords: [null, [Validators.maxLength(2000)]],
    title: [],
    description: [],
    location: [],
    isActive: [null, [Validators.required]],
    created: [],
    updated: [],
    leader: [],
    comapigns: [],
  });

  constructor(
    protected profileService: ProfileService,
    protected leaderService: LeaderService,
    protected campaignService: CampaignService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ profile }) => {
      if (profile.id === undefined) {
        const today = dayjs().startOf('day');
        profile.created = today;
        profile.updated = today;
      }

      this.updateForm(profile);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const profile = this.createFromForm();
    if (profile.id !== undefined) {
      this.subscribeToSaveResponse(this.profileService.update(profile));
    } else {
      this.subscribeToSaveResponse(this.profileService.create(profile));
    }
  }

  trackLeaderById(_index: number, item: ILeader): number {
    return item.id!;
  }

  trackCampaignById(_index: number, item: ICampaign): number {
    return item.id!;
  }

  getSelectedCampaign(option: ICampaign, selectedVals?: ICampaign[]): ICampaign {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProfile>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(profile: IProfile): void {
    this.editForm.patchValue({
      id: profile.id,
      url: profile.url,
      businessTarget: profile.businessTarget,
      targetWords: profile.targetWords,
      blockedWords: profile.blockedWords,
      title: profile.title,
      description: profile.description,
      location: profile.location,
      isActive: profile.isActive,
      created: profile.created ? profile.created.format(DATE_TIME_FORMAT) : null,
      updated: profile.updated ? profile.updated.format(DATE_TIME_FORMAT) : null,
      leader: profile.leader,
      comapigns: profile.comapigns,
    });

    this.leadersSharedCollection = this.leaderService.addLeaderToCollectionIfMissing(this.leadersSharedCollection, profile.leader);
    this.campaignsSharedCollection = this.campaignService.addCampaignToCollectionIfMissing(
      this.campaignsSharedCollection,
      ...(profile.comapigns ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.leaderService
      .query()
      .pipe(map((res: HttpResponse<ILeader[]>) => res.body ?? []))
      .pipe(map((leaders: ILeader[]) => this.leaderService.addLeaderToCollectionIfMissing(leaders, this.editForm.get('leader')!.value)))
      .subscribe((leaders: ILeader[]) => (this.leadersSharedCollection = leaders));

    this.campaignService
      .query()
      .pipe(map((res: HttpResponse<ICampaign[]>) => res.body ?? []))
      .pipe(
        map((campaigns: ICampaign[]) =>
          this.campaignService.addCampaignToCollectionIfMissing(campaigns, ...(this.editForm.get('comapigns')!.value ?? []))
        )
      )
      .subscribe((campaigns: ICampaign[]) => (this.campaignsSharedCollection = campaigns));
  }

  protected createFromForm(): IProfile {
    return {
      ...new Profile(),
      id: this.editForm.get(['id'])!.value,
      url: this.editForm.get(['url'])!.value,
      businessTarget: this.editForm.get(['businessTarget'])!.value,
      targetWords: this.editForm.get(['targetWords'])!.value,
      blockedWords: this.editForm.get(['blockedWords'])!.value,
      title: this.editForm.get(['title'])!.value,
      description: this.editForm.get(['description'])!.value,
      location: this.editForm.get(['location'])!.value,
      isActive: this.editForm.get(['isActive'])!.value,
      created: this.editForm.get(['created'])!.value ? dayjs(this.editForm.get(['created'])!.value, DATE_TIME_FORMAT) : undefined,
      updated: this.editForm.get(['updated'])!.value ? dayjs(this.editForm.get(['updated'])!.value, DATE_TIME_FORMAT) : undefined,
      leader: this.editForm.get(['leader'])!.value,
      comapigns: this.editForm.get(['comapigns'])!.value,
    };
  }
}
