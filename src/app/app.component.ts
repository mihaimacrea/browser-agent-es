import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSnackBar, MatSort} from '@angular/material';
import {ElasticsearchService} from '../service/elasticsearch.service';
import {BrowserAgentTableDataSource} from './browser-agent-table-datasource';
import {tap} from 'rxjs/internal/operators';
import {fromEvent, merge} from 'rxjs';
import {AppSettings} from './app.settings';

export interface ChipElasticSearchStatus {
  message: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  isConnected = false;
  searchEventsInput: string;
  currentElasticSearchStatus: ChipElasticSearchStatus =
    {
      message: 'Server is down!'
    };

  // Table
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('searchEvents') searchEventsButton: ElementRef;
  dataSource: BrowserAgentTableDataSource;
  displayedColumns = ['date', 'browserAgent'];
  sortInSearch = false;

  constructor(public snackBar: MatSnackBar, private es: ElasticsearchService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.es.isAvailable().then(() => {
      this.currentElasticSearchStatus = {
        message: 'Server is up!'
      };
      this.isConnected = true;
      this.es.indexExists(AppSettings.BROWSER_AGENT_INDEX_NAME).then(
        result => {
          if (result === false) {
            this.es.createIndex(AppSettings.BROWSER_AGENT_INDEX_NAME).then(
              createIndexResult => {
                console.log(createIndexResult);
              }, error => {
                console.error(error);
              }
            );
          } else {
            this.dataSource = new BrowserAgentTableDataSource(this.es);
            this.dataSource.searchEvents(null, AppSettings.PUBLISHED_DATE_ES_NAME, 'asc');
            this.dataSource.countAllEvents().then(
              response => {
                this.paginator.length = response;
              }
            );
          }
        }
      );
    }, error => {
      this.currentElasticSearchStatus = {
        message: 'Server is down!'
      };
      this.isConnected = false;
      console.error('Server is down ', error);
    }).then(() => {
      this.cd.detectChanges();
    });
  }

  ngAfterViewInit() {
    fromEvent(this.searchEventsButton['_elementRef'].nativeElement, 'click')
      .pipe(
        tap(() => {
          this.paginator.pageIndex = 0;
          this.sortInSearch = true;
          this.searchEvents(this.searchEventsInput);
        })
      )
      .subscribe();

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          if (!this.sortInSearch) {
            this.loadAllEventsPage();
          } else {
            this.searchEvents(this.searchEventsInput);
          }
        })
      )
      .subscribe();
  }

  searchEvents(event) {
    if (this.sort.active === AppSettings.PUBLISHED_DATE_TABLE_NAME) {
      this.dataSource.searchEvents(
        (event !== null && event !== undefined && event !== '') ? event : null,
        AppSettings.PUBLISHED_DATE_ES_NAME,
        this.sort.direction,
        this.paginator.pageIndex,
        this.paginator.pageSize);
    } else if (this.sort.active === AppSettings.BROWSER_AGENT_TABLE_NAME) {
      this.dataSource.searchEvents(
        (event !== null && event !== undefined && event !== '') ? event : null,
        AppSettings.BROWSER_AGENT_KEYWORD_ES_NAME,
        this.sort.direction,
        this.paginator.pageIndex,
        this.paginator.pageSize);
    }
    if (event !== null && event !== undefined && event !== '') {
      this.dataSource.countSearchEvents(event).then(
        response => {
          this.paginator.length = response;
        }
      );
    } else {
      this.dataSource.countAllEvents().then(
        response => {
          this.paginator.length = response;
        }
      );
    }
  }

  loadAllEventsPage() {
    if (this.sort.active === AppSettings.PUBLISHED_DATE_TABLE_NAME) {
      this.dataSource.searchEvents(
        null,
        AppSettings.PUBLISHED_DATE_ES_NAME,
        this.sort.direction,
        this.paginator.pageIndex,
        this.paginator.pageSize);
    } else if (this.sort.active === AppSettings.BROWSER_AGENT_TABLE_NAME) {
      this.dataSource.searchEvents(
        null,
        AppSettings.BROWSER_AGENT_KEYWORD_ES_NAME,
        this.sort.direction,
        this.paginator.pageIndex,
        this.paginator.pageSize);
    }
    this.dataSource.countAllEvents().then(
      response => {
        this.paginator.length = response;
      }
    );
  }

  sendEvent() {
    const userAgent: string = navigator.userAgent;
    this.es.indexDocument(userAgent, AppSettings.BROWSER_AGENT_INDEX_NAME).then(
      (result) => {
        this.snackBar.open('Browser event \'' + userAgent + '\' was indexed successfully.', null, {
          duration: 3000
        });
      }, error => {
        this.snackBar.open('Something went wrong during document indexation.', null, {
          duration: 3000
        });
      });
  }
}
