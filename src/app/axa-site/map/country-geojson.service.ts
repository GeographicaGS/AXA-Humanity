import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class CountryGeojsonService {

  constructor(private http: Http) {}

  getGeojson(): Observable<any[]> {
    return this.http.get(`assets/data/world_borders_hd_small.geojson`)
            .map(response => response.json() as any[]);
  }

  getCodeFromCoords(lat, lng): Observable<any[]> {
    const url = `https://axa-cdo.carto.com/api/v2/sql?q=SELECT name, adm0_a3 FROM world_borders_hd WHERE
    st_intersects(the_geom, st_setsrid(st_makepoint(${lng}, ${lat}), 4326))`;
    return this.http.get(url)
            .map(response => response.json() as any[]);
  }

}
