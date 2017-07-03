import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-axa-site',
  templateUrl: './axa-site.component.html',
  styleUrls: ['./axa-site.component.scss']
})
export class AxaSiteComponent implements OnInit {

  indicator: any = undefined;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] !== null) {
        this.indicator = params['id'];
      }
   });
  }

}
