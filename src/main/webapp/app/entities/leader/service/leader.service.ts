import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILeader, getLeaderIdentifier } from '../leader.model';

export type EntityResponseType = HttpResponse<ILeader>;
export type EntityArrayResponseType = HttpResponse<ILeader[]>;

@Injectable({ providedIn: 'root' })
export class LeaderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/leaders');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(leader: ILeader): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(leader);
    return this.http
      .post<ILeader>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(leader: ILeader): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(leader);
    return this.http
      .put<ILeader>(`${this.resourceUrl}/${getLeaderIdentifier(leader) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(leader: ILeader): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(leader);
    return this.http
      .patch<ILeader>(`${this.resourceUrl}/${getLeaderIdentifier(leader) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ILeader>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ILeader[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLeaderToCollectionIfMissing(leaderCollection: ILeader[], ...leadersToCheck: (ILeader | null | undefined)[]): ILeader[] {
    const leaders: ILeader[] = leadersToCheck.filter(isPresent);
    if (leaders.length > 0) {
      const leaderCollectionIdentifiers = leaderCollection.map(leaderItem => getLeaderIdentifier(leaderItem)!);
      const leadersToAdd = leaders.filter(leaderItem => {
        const leaderIdentifier = getLeaderIdentifier(leaderItem);
        if (leaderIdentifier == null || leaderCollectionIdentifiers.includes(leaderIdentifier)) {
          return false;
        }
        leaderCollectionIdentifiers.push(leaderIdentifier);
        return true;
      });
      return [...leadersToAdd, ...leaderCollection];
    }
    return leaderCollection;
  }

  protected convertDateFromClient(leader: ILeader): ILeader {
    return Object.assign({}, leader, {
      created: leader.created?.isValid() ? leader.created.toJSON() : undefined,
      updated: leader.updated?.isValid() ? leader.updated.toJSON() : undefined,
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
      res.body.forEach((leader: ILeader) => {
        leader.created = leader.created ? dayjs(leader.created) : undefined;
        leader.updated = leader.updated ? dayjs(leader.updated) : undefined;
      });
    }
    return res;
  }
}
