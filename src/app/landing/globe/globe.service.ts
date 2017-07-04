import { Component, OnInit } from '@angular/core';

const DATA = [{
    type: 'dark',
    value: 371000,
    units: 'children are born everyday',
    title: 'One',
    subtitle: 'in 10 has healthcare',
    position : [37, 4],
    zone: 'Asia occidental'
  },
  {
    type: 'dark',
    value: 370000,
    units: 'children are born weekly',
    title: 'Two',
    subtitle: 'in 10 has healthcare',
    position : [0, 0],
    zone: 'Asia occidental'
  },
  {
    type: 'light',
    value: 371000,
    units: 'children are born everyday',
    title: 'One',
    subtitle: 'in 10 has healthcare',
    position : [-40, 40],
    zone: 'Asia occidental'
  },
  {
    type: 'light',
    value: 370000,
    units: 'children are born weekly',
    title: 'Two',
    subtitle: 'in 10 has healthcare',
    position : [40, 40],
    zone: 'Asia occidental'
  }];

export class GlobeService {

  constructor() { }

  getData(type: string) {
    return DATA.filter( a => a.type === type);
  }

}
