import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class IndicatorService {

  constructor(private http: Http) {}

  getIndicators(): Observable<any[]> {
    return this.http.get(`assets/data/indicators.json`)
            .map(response => response.json() as any[]);
  }

}
