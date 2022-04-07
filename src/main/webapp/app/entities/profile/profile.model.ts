import dayjs from 'dayjs/esm';
import { ILeader } from 'app/entities/leader/leader.model';
import { ICampaign } from 'app/entities/campaign/campaign.model';

export interface IProfile {
  id?: number;
  url?: string;
  businessTarget?: boolean;
  targetWords?: string | null;
  blockedWords?: string | null;
  title?: string | null;
  description?: string | null;
  location?: string | null;
  isActive?: boolean;
  created?: dayjs.Dayjs | null;
  updated?: dayjs.Dayjs | null;
  leader?: ILeader | null;
  comapigns?: ICampaign[] | null;
}

export class Profile implements IProfile {
  constructor(
    public id?: number,
    public url?: string,
    public businessTarget?: boolean,
    public targetWords?: string | null,
    public blockedWords?: string | null,
    public title?: string | null,
    public description?: string | null,
    public location?: string | null,
    public isActive?: boolean,
    public created?: dayjs.Dayjs | null,
    public updated?: dayjs.Dayjs | null,
    public leader?: ILeader | null,
    public comapigns?: ICampaign[] | null
  ) {
    this.businessTarget = this.businessTarget ?? false;
    this.isActive = this.isActive ?? false;
  }
}

export function getProfileIdentifier(profile: IProfile): number | undefined {
  return profile.id;
}
