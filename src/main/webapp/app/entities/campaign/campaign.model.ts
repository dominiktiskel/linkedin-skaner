import dayjs from 'dayjs/esm';
import { IProfile } from 'app/entities/profile/profile.model';

export interface ICampaign {
  id?: number;
  title?: string | null;
  message?: string;
  description?: string | null;
  isActive?: boolean;
  created?: dayjs.Dayjs | null;
  updated?: dayjs.Dayjs | null;
  profiles?: IProfile[] | null;
}

export class Campaign implements ICampaign {
  constructor(
    public id?: number,
    public title?: string | null,
    public message?: string,
    public description?: string | null,
    public isActive?: boolean,
    public created?: dayjs.Dayjs | null,
    public updated?: dayjs.Dayjs | null,
    public profiles?: IProfile[] | null
  ) {
    this.isActive = this.isActive ?? false;
  }
}

export function getCampaignIdentifier(campaign: ICampaign): number | undefined {
  return campaign.id;
}
