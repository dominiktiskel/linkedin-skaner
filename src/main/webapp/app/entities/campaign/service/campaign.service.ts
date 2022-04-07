import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICampaign, getCampaignIdentifier } from '../campaign.model';

export type EntityResponseType = HttpResponse<ICampaign>;
export type EntityArrayResponseType = HttpResponse<ICampaign[]>;

@Injectable({ providedIn: 'root' })
export class CampaignService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/campaigns');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(campaign: ICampaign): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(campaign);
    return this.http
      .post<ICampaign>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(campaign: ICampaign): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(campaign);
    return this.http
      .put<ICampaign>(`${this.resourceUrl}/${getCampaignIdentifier(campaign) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(campaign: ICampaign): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(campaign);
    return this.http
      .patch<ICampaign>(`${this.resourceUrl}/${getCampaignIdentifier(campaign) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICampaign>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICampaign[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCampaignToCollectionIfMissing(campaignCollection: ICampaign[], ...campaignsToCheck: (ICampaign | null | undefined)[]): ICampaign[] {
    const campaigns: ICampaign[] = campaignsToCheck.filter(isPresent);
    if (campaigns.length > 0) {
      const campaignCollectionIdentifiers = campaignCollection.map(campaignItem => getCampaignIdentifier(campaignItem)!);
      const campaignsToAdd = campaigns.filter(campaignItem => {
        const campaignIdentifier = getCampaignIdentifier(campaignItem);
        if (campaignIdentifier == null || campaignCollectionIdentifiers.includes(campaignIdentifier)) {
          return false;
        }
        campaignCollectionIdentifiers.push(campaignIdentifier);
        return true;
      });
      return [...campaignsToAdd, ...campaignCollection];
    }
    return campaignCollection;
  }

  protected convertDateFromClient(campaign: ICampaign): ICampaign {
    return Object.assign({}, campaign, {
      created: campaign.created?.isValid() ? campaign.created.toJSON() : undefined,
      updated: campaign.updated?.isValid() ? campaign.updated.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.created = res.body.created ? dayjs(res.body.created) : undefined;
      res.body.updated = res.body.updated ? dayjs(res.body.updated) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((campaign: ICampaign) => {
        campaign.created = campaign.created ? dayjs(campaign.created) : undefined;
        campaign.updated = campaign.updated ? dayjs(campaign.updated) : undefined;
      });
    }
    return res;
  }
}
