import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ILeader, Leader } from '../leader.model';

import { LeaderService } from './leader.service';

describe('Leader Service', () => {
  let service: LeaderService;
  let httpMock: HttpTestingController;
  let elemDefault: ILeader;
  let expectedResult: ILeader | ILeader[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LeaderService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      url: 'AAAAAAA',
      title: 'AAAAAAA',
      description: 'AAAAAAA',
      location: 'AAAAAAA',
      isActive: false,
      created: currentDate,
      updated: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          created: currentDate.format(DATE_TIME_FORMAT),
          updated: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Leader', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          created: currentDate.format(DATE_TIME_FORMAT),
          updated: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          created: currentDate,
          updated: currentDate,
        },
        returnedFromService
      );

      service.create(new Leader()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Leader', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          url: 'BBBBBB',
          title: 'BBBBBB',
          description: 'BBBBBB',
          location: 'BBBBBB',
          isActive: true,
          created: currentDate.format(DATE_TIME_FORMAT),
          updated: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          created: currentDate,
          updated: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Leader', () => {
      const patchObject = Object.assign(
        {
          url: 'BBBBBB',
          title: 'BBBBBB',
          description: 'BBBBBB',
          created: currentDate.format(DATE_TIME_FORMAT),
        },
        new Leader()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          created: currentDate,
          updated: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Leader', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          url: 'BBBBBB',
          title: 'BBBBBB',
          description: 'BBBBBB',
          location: 'BBBBBB',
          isActive: true,
          created: currentDate.format(DATE_TIME_FORMAT),
          updated: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          created: currentDate,
          updated: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Leader', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLeaderToCollectionIfMissing', () => {
      it('should add a Leader to an empty array', () => {
        const leader: ILeader = { id: 123 };
        expectedResult = service.addLeaderToCollectionIfMissing([], leader);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(leader);
      });

      it('should not add a Leader to an array that contains it', () => {
        const leader: ILeader = { id: 123 };
        const leaderCollection: ILeader[] = [
          {
            ...leader,
          },
          { id: 456 },
        ];
        expectedResult = service.addLeaderToCollectionIfMissing(leaderCollection, leader);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Leader to an array that doesn't contain it", () => {
        const leader: ILeader = { id: 123 };
        const leaderCollection: ILeader[] = [{ id: 456 }];
        expectedResult = service.addLeaderToCollectionIfMissing(leaderCollection, leader);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(leader);
      });

      it('should add only unique Leader to an array', () => {
        const leaderArray: ILeader[] = [{ id: 123 }, { id: 456 }, { id: 50614 }];
        const leaderCollection: ILeader[] = [{ id: 123 }];
        expectedResult = service.addLeaderToCollectionIfMissing(leaderCollection, ...leaderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const leader: ILeader = { id: 123 };
        const leader2: ILeader = { id: 456 };
        expectedResult = service.addLeaderToCollectionIfMissing([], leader, leader2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(leader);
        expect(expectedResult).toContain(leader2);
      });

      it('should accept null and undefined values', () => {
        const leader: ILeader = { id: 123 };
        expectedResult = service.addLeaderToCollectionIfMissing([], null, leader, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(leader);
      });

      it('should return initial array if no Leader is added', () => {
        const leaderCollection: ILeader[] = [{ id: 123 }];
        expectedResult = service.addLeaderToCollectionIfMissing(leaderCollection, undefined, null);
        expect(expectedResult).toEqual(leaderCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
