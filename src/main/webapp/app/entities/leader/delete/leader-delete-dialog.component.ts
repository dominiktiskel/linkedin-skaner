import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILeader } from '../leader.model';
import { LeaderService } from '../service/leader.service';

@Component({
  templateUrl: './leader-delete-dialog.component.html',
})
export class LeaderDeleteDialogComponent {
  leader?: ILeader;

  constructor(protected leaderService: LeaderService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.leaderService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
