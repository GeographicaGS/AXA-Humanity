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

  getKpiData(table, country = null): Observable<any[]> {
    let where = '';
    if (country) {
      where = ` WHERE iso3 = '${country}'`;
    }
    return this.http.get(`https://axa-cdo.carto.com/api/v2/sql?q=SELECT data FROM ${table} ${where}`)
            .map(response => response.json() as any[]);
  }
}
