import {Component, OnInit, ViewChild} from '@angular/core';
import {AppState} from "../app-state";
import {HttpClient} from "@angular/common/http";
import {MatSort, MatTableDataSource} from "@angular/material";

@Component({
  selector: 'app-open-event-list',
  templateUrl: './open-event-list.component.html',
  styleUrls: ['./open-event-list.component.css']
})
export class OpenEventListComponent implements OnInit {
  year: number;
  tournaments: OpenTournament[] = [];
  tableData = new MatTableDataSource(this.tournaments);
  columnsToDisplay: string[] = ['province', 'name', 'mrating', 'frating'];

  @ViewChild(MatSort) sort: MatSort;

  constructor(public appState: AppState,
              public http: HttpClient) {
  }

  ngOnInit() {
    // Watch for changes to the the selected ranking group or ranking year
    // in which case we reset the event selector
    this.appState.selectedRankingYear$.subscribe(y => {
      this.fetchOpenTournaments(parseInt(y, 10));
    });
    this.tableData.sort = this.sort;
  }

  ngOnChange() {
    this.appState.selectedRankingYear$.subscribe(y => {
      this.fetchOpenTournaments(parseInt(y, 10));
    });
  }


  // Load the Open tournament List
  // There is a workbook in google docs which supplies the list of all the Open tournaments in Canada.
  // It has one worksheet per year.
  // This function goes and gets the sheet for a given year as  JSON object.
  // The JSON object is very bloated.
  // The meat of the spreadsheet is in the returned data.feed.entry
  // The fields are all the column names in lower case prefixed by gsx$
  // The column content is an object with a field named $t which contains the content as text.
  // The consumer of this object needs to know this structure.
  // TODO error handling - what if there is a 2019 in the years menu
  // but Tennis Canada has not done the sheet yet?
  fetchOpenTournaments(year:number) {
    let tournaments: OpenTournament[] = [];
    // 2013 is the second worksheet, 2014 the third and so on.
    const sheet = year - 2011;
    let r: number;
    this.http.get(
      'https://spreadsheets.google.com/feeds/list/0AnMBHcdDDoB8dHQzcUlaWFExVHBVaDMwYXRWLWtBWGc/' +
      sheet.toString() + '/public/values?alt=json')
      .subscribe(data => {
        const feed: any = data['feed'];
        // Take the returned JSON and stuff it in something more useful.
        for (const t of feed.entry) {
          const tournament: OpenTournament = new OpenTournament(
            t.title['$t'],
            t['gsx$prov']['$t'],
            (t['gsx$men']['$t'] && "-" !== t['gsx$men']['$t']) ? t['gsx$men']['$t'] : null,
            (t['gsx$women']['$t']  && "-" !== t['gsx$women']['$t']) ? t['gsx$women']['$t'] : null
          );
          tournaments.push(tournament);
          // console.log(JSON.stringify(tournament))
        }
        this.tableData.data = tournaments;
      })
  }

  applyFilter(filterValue: string) {
    this.tableData.filter = filterValue.trim().toLowerCase();
  }

}

class OpenTournament {
  constructor( public name: string,
               public province: string,
               public mrating: string,
               public frating: string,) {
  }
}
