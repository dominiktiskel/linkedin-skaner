import dayjs from 'dayjs/esm';

export interface ILeader {
  id?: number;
  url?: string | null;
  title?: string | null;
  description?: string | null;
  location?: string | null;
  isActive?: boolean;
  created?: dayjs.Dayjs | null;
  updated?: dayjs.Dayjs | null;
}

export class Leader implements ILeader {
  constructor(
    public id?: number,
    public url?: string | null,
    public title?: string | null,
    public description?: string | null,
    public location?: string | null,
    public isActive?: boolean,
    public created?: dayjs.Dayjs | null,
    public updated?: dayjs.Dayjs | null
  ) {
    this.isActive = this.isActive ?? false;
  }
}

export function getLeaderIdentifier(leader: ILeader): number | undefined {
  return leader.id;
}
