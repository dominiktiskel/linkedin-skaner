import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ILeader, Leader } from '../leader.model';
import { LeaderService } from '../service/leader.service';

@Component({
  selector: 'jhi-leader-update',
  templateUrl: './leader-update.component.html',
})
export class LeaderUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    url: [null, [Validators.maxLength(2000)]],
    title: [],
    description: [],
    location: [],
    isActive: [null, [Validators.required]],
    created: [],
    updated: [],
  });

  constructor(protected leaderService: LeaderService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ leader }) => {
      if (leader.id === undefined) {
        const today = dayjs().startOf('day');
        leader.created = today;
        leader.updated = today;
      }

      this.updateForm(leader);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const leader = this.createFromForm();
    if (leader.id !== undefined) {
      this.subscribeToSaveResponse(this.leaderService.update(leader));
    } else {
      this.subscribeToSaveResponse(this.leaderService.create(leader));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILeader>>): void {
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

  protected updateForm(leader: ILeader): void {
    this.editForm.patchValue({
      id: leader.id,
      url: leader.url,
      title: leader.title,
      description: leader.description,
      location: leader.location,
      isActive: leader.isActive,
      created: leader.created ? leader.created.format(DATE_TIME_FORMAT) : null,
      updated: leader.updated ? leader.updated.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): ILeader {
    return {
      ...new Leader(),
      id: this.editForm.get(['id'])!.value,
      url: this.editForm.get(['url'])!.value,
      title: this.editForm.get(['title'])!.value,
      description: this.editForm.get(['description'])!.value,
      location: this.editForm.get(['location'])!.value,
      isActive: this.editForm.get(['isActive'])!.value,
      created: this.editForm.get(['created'])!.value ? dayjs(this.editForm.get(['created'])!.value, DATE_TIME_FORMAT) : undefined,
      updated: this.editForm.get(['updated'])!.value ? dayjs(this.editForm.get(['updated'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
