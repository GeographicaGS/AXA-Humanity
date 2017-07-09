import { Component, OnInit } from '@angular/core';

const DATA = [{
    type: 'dark',
    value: 371000,
    units: 'children are born everyday',
    title: 'One',
    subtitle: 'in 10 has healthcare',
    position : [31, 72],
    zone: 'Asia occidental'
  },
  {
    type: 'dark',
    value: 422,
    units: 'Million people',
    title: 'One',
    subtitle: 'in 9 will have pension',
    position : [0, -61],
    zone: 'South America'
  },
  {
    type: 'dark',
    value: 69,
    units: 'of entrepreneurs women have',
    units_value: '%',
    title: '0 €',
    subtitle: 'on protection or savings oriented life insurance',
    position : [10, 48],
    zone: 'Europe'
  },
  {
    type: 'dark',
    value: 70,
    units: 'of rise in the sea level in this century',
    units_value: 'cm',
    title: '100 M people',
    subtitle: 'will be displaced by the elevation of waters',
    position : [-41, 66],
    zone: 'Poles'
  },
  {
    type: 'light',
    value: 1,
    units: 'World Ranking of Insurer Innovation',
    title: 'Nº 30',
    subtitle: 'from all sectors',
    position : [47, 2],
    zone: 'AXA Worldwide'
  },
  {
    type: 'light',
    value: 166,
    units: 'million committed',
    title: '531 projects',
    subtitle: 'supported by AXA Research Fund',
    position : [13, 12],
    zone: 'AXA Worldwide'
  },
  {
    type: 'light',
    value: 20279,
    units: 'new hires',
    title: 'Per year',
    subtitle: 'worldwide',
    position : [13, 12],
    zone: 'AXA Worldwide'
  },
  {
    type: 'light',
    value: 4000,
    units: 'new policies in its first month',
    title: 'Smart Women Plan',
    subtitle: 'Product of the Year, 2013',
    position : [78, 20],
    zone: 'India'
  }];

export class GlobeService {

  constructor() { }

  getData(type: string) {
    return DATA.filter( a => a.type === type);
  }

}
