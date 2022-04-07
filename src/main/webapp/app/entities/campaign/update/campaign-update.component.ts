import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ICampaign, Campaign } from '../campaign.model';
import { CampaignService } from '../service/campaign.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-campaign-update',
  templateUrl: './campaign-update.component.html',
})
export class CampaignUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    title: [],
    message: [null, [Validators.required]],
    description: [],
    isActive: [null, [Validators.required]],
    created: [],
    updated: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected campaignService: CampaignService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ campaign }) => {
      if (campaign.id === undefined) {
        const today = dayjs().startOf('day');
        campaign.created = today;
        campaign.updated = today;
      }

      this.updateForm(campaign);
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('linkedinSkanerApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const campaign = this.createFromForm();
    if (campaign.id !== undefined) {
      this.subscribeToSaveResponse(this.campaignService.update(campaign));
    } else {
      this.subscribeToSaveResponse(this.campaignService.create(campaign));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICampaign>>): void {
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

  protected updateForm(campaign: ICampaign): void {
    this.editForm.patchValue({
      id: campaign.id,
      title: campaign.title,
      message: campaign.message,
      description: campaign.description,
      isActive: campaign.isActive,
      created: campaign.created ? campaign.created.format(DATE_TIME_FORMAT) : null,
      updated: campaign.updated ? campaign.updated.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): ICampaign {
    return {
      ...new Campaign(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      message: this.editForm.get(['message'])!.value,
      description: this.editForm.get(['description'])!.value,
      isActive: this.editForm.get(['isActive'])!.value,
      created: this.editForm.get(['created'])!.value ? dayjs(this.editForm.get(['created'])!.value, DATE_TIME_FORMAT) : undefined,
      updated: this.editForm.get(['updated'])!.value ? dayjs(this.editForm.get(['updated'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
