import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class CountryGeojsonService {

  constructor(private http: Http) {}

  getGeojson(): Observable<any[]> {
    return this.http.get(`assets/data/world_borders.geojson`)
            .map(response => response.json() as any[]);
  }

}
