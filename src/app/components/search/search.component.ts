import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent {
  constructor(
    private router: Router) { }

  ngOnInit() {

  }

  doSearch(value: string) {
    this.router.navigateByUrl('/search/' + value);
  }
}
