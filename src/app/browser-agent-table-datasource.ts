import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Observable, BehaviorSubject} from 'rxjs';
import {ElasticsearchService} from '../service/elasticsearch.service';
import {AppSettings} from './app.settings';

export class BrowserAgentTableItem {
  browserAgent: string;
  date: string;
}

export class BrowserAgentTableDataSource implements DataSource<BrowserAgentTableItem> {

  private dataSubject = new BehaviorSubject<BrowserAgentTableItem[]>([]);

  constructor(private es: ElasticsearchService) {}

  connect(collectionViewer: CollectionViewer): Observable<BrowserAgentTableItem[]> {
    return this.dataSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataSubject.complete();
  }

  searchEvents(searchEventsInput: string, sortField, sortOrder, pageIndex = 0, pageSize = 5) {
    if (searchEventsInput === null || searchEventsInput === '') {
      this.es.getAllDocumentsPaginated(AppSettings.BROWSER_AGENT_INDEX_NAME, sortField, sortOrder, pageIndex, pageSize).then(
        result => {
          const data: BrowserAgentTableItem[] = [];
          const hitsOuterObject = result['hits'];
          for (const hit in hitsOuterObject['hits']) {
            if (hitsOuterObject['hits'].hasOwnProperty(hit)) {
              const tableItem: BrowserAgentTableItem = new BrowserAgentTableItem();
              const source = hitsOuterObject['hits'][hit]['_source'];

              tableItem.date = source[AppSettings.PUBLISHED_DATE_ES_NAME];
              tableItem.browserAgent = source[AppSettings.BROWSER_AGENT_ES_NAME];
              data.push(tableItem);
            }
          }
          this.dataSubject.next(data);
        }
      );
    } else {
      this.es.search(searchEventsInput, AppSettings.BROWSER_AGENT_INDEX_NAME,  sortField, sortOrder, pageIndex, pageSize).then(
        result => {
          const data: BrowserAgentTableItem[] = [];
          const hitsOuterObject = result['hits'];
          for (const hit in hitsOuterObject['hits']) {
            if (hitsOuterObject['hits'].hasOwnProperty(hit)) {
              const tableItem: BrowserAgentTableItem = new BrowserAgentTableItem();
              const source = hitsOuterObject['hits'][hit]['_source'];

              tableItem.date = source[AppSettings.PUBLISHED_DATE_ES_NAME];
              tableItem.browserAgent = source[AppSettings.BROWSER_AGENT_ES_NAME];
              data.push(tableItem);
            }
          }
          this.dataSubject.next(data);
        }
      );
    }
  }

  countAllEvents() {
    return this.es.getAllDocuments(AppSettings.BROWSER_AGENT_INDEX_NAME).then(
      result => {
        const hitsOuterObject = result['hits'];
        return hitsOuterObject['total'];
      }
    );
  }

  countSearchEvents(event) {
    return this.es.getAllSearchDocuments(event, AppSettings.BROWSER_AGENT_INDEX_NAME).then(
      result => {
        const hitsOuterObject = result['hits'];
        return hitsOuterObject['total'];
      }
    );
  }
}
