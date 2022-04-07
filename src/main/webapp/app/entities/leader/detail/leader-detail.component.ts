import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILeader } from '../leader.model';

@Component({
  selector: 'jhi-leader-detail',
  templateUrl: './leader-detail.component.html',
})
export class LeaderDetailComponent implements OnInit {
  leader: ILeader | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ leader }) => {
      this.leader = leader;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
