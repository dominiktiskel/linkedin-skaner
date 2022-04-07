import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICampaign, Campaign } from '../campaign.model';

import { CampaignService } from './campaign.service';

describe('Campaign Service', () => {
  let service: CampaignService;
  let httpMock: HttpTestingController;
  let elemDefault: ICampaign;
  let expectedResult: ICampaign | ICampaign[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CampaignService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      title: 'AAAAAAA',
      message: 'AAAAAAA',
      description: 'AAAAAAA',
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

    it('should create a Campaign', () => {
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

      service.create(new Campaign()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Campaign', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          message: 'BBBBBB',
          description: 'BBBBBB',
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

    it('should partial update a Campaign', () => {
      const patchObject = Object.assign(
        {
          message: 'BBBBBB',
          description: 'BBBBBB',
          isActive: true,
          created: currentDate.format(DATE_TIME_FORMAT),
          updated: currentDate.format(DATE_TIME_FORMAT),
        },
        new Campaign()
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

    it('should return a list of Campaign', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          message: 'BBBBBB',
          description: 'BBBBBB',
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

    it('should delete a Campaign', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCampaignToCollectionIfMissing', () => {
      it('should add a Campaign to an empty array', () => {
        const campaign: ICampaign = { id: 123 };
        expectedResult = service.addCampaignToCollectionIfMissing([], campaign);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(campaign);
      });

      it('should not add a Campaign to an array that contains it', () => {
        const campaign: ICampaign = { id: 123 };
        const campaignCollection: ICampaign[] = [
          {
            ...campaign,
          },
          { id: 456 },
        ];
        expectedResult = service.addCampaignToCollectionIfMissing(campaignCollection, campaign);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Campaign to an array that doesn't contain it", () => {
        const campaign: ICampaign = { id: 123 };
        const campaignCollection: ICampaign[] = [{ id: 456 }];
        expectedResult = service.addCampaignToCollectionIfMissing(campaignCollection, campaign);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(campaign);
      });

      it('should add only unique Campaign to an array', () => {
        const campaignArray: ICampaign[] = [{ id: 123 }, { id: 456 }, { id: 56906 }];
        const campaignCollection: ICampaign[] = [{ id: 123 }];
        expectedResult = service.addCampaignToCollectionIfMissing(campaignCollection, ...campaignArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const campaign: ICampaign = { id: 123 };
        const campaign2: ICampaign = { id: 456 };
        expectedResult = service.addCampaignToCollectionIfMissing([], campaign, campaign2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(campaign);
        expect(expectedResult).toContain(campaign2);
      });

      it('should accept null and undefined values', () => {
        const campaign: ICampaign = { id: 123 };
        expectedResult = service.addCampaignToCollectionIfMissing([], null, campaign, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(campaign);
      });

      it('should return initial array if no Campaign is added', () => {
        const campaignCollection: ICampaign[] = [{ id: 123 }];
        expectedResult = service.addCampaignToCollectionIfMissing(campaignCollection, undefined, null);
        expect(expectedResult).toEqual(campaignCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
