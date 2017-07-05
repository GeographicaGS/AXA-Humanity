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

  getKpiStatistics(table): Observable<any[]> {
    return this.http.get(`https://axa-cdo.carto.com/api/v2/sql?q=SELECT
      MAX(data) as max_value,
      MIN(data) as min_value,
      (SELECT name FROM ${table} WHERE data is not null ORDER BY data ASC LIMIT 1) as min_country,
      (SELECT name FROM ${table} WHERE data is not null ORDER BY data DESC LIMIT 1) as max_country,
      AVG(data) as avg_value
       FROM ${table}`)
      .map(response => response.json() as any[]);
  }
}
