import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'leader',
        data: { pageTitle: 'linkedinSkanerApp.leader.home.title' },
        loadChildren: () => import('./leader/leader.module').then(m => m.LeaderModule),
      },
      {
        path: 'profile',
        data: { pageTitle: 'linkedinSkanerApp.profile.home.title' },
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      },
      {
        path: 'campaign',
        data: { pageTitle: 'linkedinSkanerApp.campaign.home.title' },
        loadChildren: () => import('./campaign/campaign.module').then(m => m.CampaignModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
