import { Component, OnInit } from '@angular/core';

export class GlobeService {

  constructor() { }

  getData() {
    return [{
      type: 'dark',
      value: 371000,
      units: 'children are born everyday',
      title: 'One',
      subtitle: 'in 10 has healthcare',
      position : [37, 4]
    },
    {
      type: 'dark',
      value: 370000,
      units: 'children are born weekly',
      title: 'Two',
      subtitle: 'in 10 has healthcare',
      position : [0, 0]
    }];
  }

}
