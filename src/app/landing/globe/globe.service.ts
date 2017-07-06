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
    units: 'million people',
    title: 'One',
    subtitle: 'in 9 will have pension',
    position : [0, -61],
    zone: 'South America'
  },
  {
    type: 'light',
    value: 1,
    units: 'World Ranking of Insurer Innovation',
    title: '30',
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
  }];

export class GlobeService {

  constructor() { }

  getData(type: string) {
    return DATA.filter( a => a.type === type);
  }

}
