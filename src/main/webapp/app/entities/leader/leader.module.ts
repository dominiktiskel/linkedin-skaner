import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LeaderComponent } from './list/leader.component';
import { LeaderDetailComponent } from './detail/leader-detail.component';
import { LeaderUpdateComponent } from './update/leader-update.component';
import { LeaderDeleteDialogComponent } from './delete/leader-delete-dialog.component';
import { LeaderRoutingModule } from './route/leader-routing.module';

@NgModule({
  imports: [SharedModule, LeaderRoutingModule],
  declarations: [LeaderComponent, LeaderDetailComponent, LeaderUpdateComponent, LeaderDeleteDialogComponent],
  entryComponents: [LeaderDeleteDialogComponent],
})
export class LeaderModule {}
