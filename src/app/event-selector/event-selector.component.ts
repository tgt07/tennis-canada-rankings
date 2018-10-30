import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AppState} from "../app-state";
import {EventGroup, RankingEvent} from "../ranking-event";
import {RankingGroup} from "../ranking-group";
import {Province} from "../province";
import {AgeGroup} from "../age-group";
import {JUNIOR_AGE_GROUPS} from "../../assets/age-groups";
import {PROVINCES} from "../../assets/provinces/province-data";
import {MatDialog} from "@angular/material";
import {EventStructureDialog} from "../event-structure-dialog/event-structure.component";
import {ReadMoreDialogComponent} from "../read-more-dialog/read-more-dialog.component";

@Component({
  selector: 'app-event-selector',
  templateUrl: './event-selector.component.html',
  styleUrls: ['./event-selector.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EventSelectorComponent implements OnInit {
  // The currently selected ranking group - possibly should be an Input
  rankingGroup: RankingGroup;

  // The event groups in this ranking group
  eventGroups: EventGroup[];
  selectedEventGroup: EventGroup;

  // the sub-groups of the selected event group
  eventSubGroups: EventGroup[];
  selectedEventSubGroup: EventGroup;

  // the events in the selected group or subgroup from which the user
  // can choose
  events: RankingEvent[];

  // The event to be shown on the points table
  selectedEvent: RankingEvent;

  // the selected province, initially from global state.
  selectedProvince: Province;

  // The selected ranking year, from global state
  year: string;

  // a convenience variable for when we are dealing with
  // this special event group.
  isJuniorRegional:boolean;

  // available choices in for juniors
  juniorAgeGroups: AgeGroup[] = JUNIOR_AGE_GROUPS;
  selectedAgeGroup: AgeGroup;

  // SelectedDrawSize
  baseDrawSize:number = 128;
  selectedDrawSize:number = 128;

  // FinishPosition
  selectedFinishPosition:number = 1;

  constructor(public appState: AppState,
              public eventStructureDialog: MatDialog,
              public readMoreDialog:MatDialog,
              ) {
    // Watch for changes to the the selected ranking group or ranking year
    // in which case we reset the event selector
    this.appState.selectedRankingYear$.subscribe(y => {
      this.year = y;
      this.ngOnChanges();
    });
    this.appState.selectedRankingGroup$.subscribe(rg => {
      this.rankingGroup = rg;
      this.ngOnChanges();
    });
    // If the user changes the selected province we may need
    // to make some changes as well.
    this.appState.selectedProvince$.subscribe(p => {
      this.onProvinceChange(p);
    });
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.rankingGroup) {
      // every ranking group has a KeyedStaticCollection of EventGroups
      // convert them to an array of event groups that are correct for the
      // selected ranking year. Then select the first one.
      this.eventGroups = this.rankingGroup.eventGroups.map(eg =>
        eg.getVersion(this.year));
      this.onSelectEventGroup(this.eventGroups[0]);
    }
  }

  onSelectEventGroup(eg: EventGroup) {
    // some event groups have KeyedStaticCollection of sub EventGroups
    // if so, make an array of the appropriate version of each and select the first
    this.isJuniorRegional = false;
    this.selectedEventGroup = eg;
    if (eg.numSubGroups()) {
      this.eventSubGroups = this.selectedEventGroup.subGroups.map( eg =>
        eg.getVersion(this.year));
      this.isJuniorRegional =  (eg.name == "_jr_regional_eg_");
      if (this.isJuniorRegional) {
        // For the Junior Regional group there is one sub-group per PTA
        // So, we auto select the one that corresponds to the current context
        // of the app.  For example, if the user has selected Manitoba from
        // the Province menu, then we go get the Manitoba subgroup of events.
        this.onProvinceChange(this.appState.selectedProvince);
        this.onSelectAgeGroup(this.juniorAgeGroups[0]);
      } else {
        // otherwise, just select the first sub group
        this.onSelectEventSubGroup(this.eventSubGroups[0]);
      }
    } else {
      this.eventSubGroups = null;
      this.selectedEventSubGroup = null;
      this.events = eg.rankingEvents;
      this.onSelectEvent(eg.rankingEvents[0]);
    }
  }

  // only junior regional events use a regional (provincial) rating
  onProvinceChange(p:Province){
    this.selectedProvince = p;
    if (this.isJuniorRegional) {
      // For the Junior Regional group there is one sub-group per PTA
      // So, we auto select the one that corresponds to the selected province.
      this.onSelectEventSubGroup(this.eventSubGroups.find(eg => {
        return eg.name == this.appState.selectedProvince.name;
      }));
    }
  }

  onSelectEventSubGroup(esg: EventGroup) {
    if (this.isJuniorRegional) {
      this.selectedProvince = PROVINCES.getItem(esg.name)

    }
    this.selectedEventSubGroup = esg;
    this.events = esg.rankingEvents;
    this.onSelectEvent(this.events[0]);
  }

  onSelectEvent(e: RankingEvent) {
    this.selectedEvent = e;
    this.baseDrawSize = e.getBaseDrawSize();
    this.selectedDrawSize = (this.baseDrawSize) ? this.baseDrawSize : 128;

  }

  onSelectAgeGroup(ag:AgeGroup){
    this.selectedAgeGroup = ag;
  }

  onDrawSizeChange() {
    if (this.selectedDrawSize < this.selectedFinishPosition) {
      this.selectedFinishPosition = this.selectedDrawSize;
    }
  }

  onShowEventStructure(eg) {
    this.eventStructureDialog.open(EventStructureDialog, {
      width: '600px',
      data: {eventGroup: eg, province: this.selectedProvince, year: this.year}
    })
  }

  onReadMore() {
    if (this.selectedEventSubGroup.conceptGroup) {
      this.readMoreDialog.open(ReadMoreDialogComponent,
        {
          width: '600px',
          data: {conceptGroup: this.selectedEventSubGroup.conceptGroup}
        })
    }
  }
}
