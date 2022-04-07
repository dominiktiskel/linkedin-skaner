import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LeaderComponent } from '../list/leader.component';
import { LeaderDetailComponent } from '../detail/leader-detail.component';
import { LeaderUpdateComponent } from '../update/leader-update.component';
import { LeaderRoutingResolveService } from './leader-routing-resolve.service';

const leaderRoute: Routes = [
  {
    path: '',
    component: LeaderComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LeaderDetailComponent,
    resolve: {
      leader: LeaderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LeaderUpdateComponent,
    resolve: {
      leader: LeaderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LeaderUpdateComponent,
    resolve: {
      leader: LeaderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(leaderRoute)],
  exports: [RouterModule],
})
export class LeaderRoutingModule {}
