import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILeader, Leader } from '../leader.model';
import { LeaderService } from '../service/leader.service';

@Injectable({ providedIn: 'root' })
export class LeaderRoutingResolveService implements Resolve<ILeader> {
  constructor(protected service: LeaderService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILeader> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((leader: HttpResponse<Leader>) => {
          if (leader.body) {
            return of(leader.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Leader());
  }
}
