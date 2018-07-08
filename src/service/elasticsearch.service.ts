import { Injectable } from '@angular/core';
import * as elasticsearch from 'elasticsearch-browser';

@Injectable()
export class ElasticsearchService {

  private client = new elasticsearch.Client({host: 'localhost:9200',log: 'trace', version: '5.5'});

  constructor() {
  }

  createIndex(indexName): any {
    return this.client.indices.create({
      index: indexName,
      body: {
        mappings: {
          'browserAgent': {
            properties: {
              browserAgent: {
                type: 'keyword',
                fields: {
                  keyword: {
                    type: 'keyword'
                  }
                }
              },
              publishedDate: {
                type: 'date',
                fielddata: true
              }
            }
          }
        }
      }
    });
  }

  indexExists(indexName): any {
    return this.client.indices.exists({index: indexName});
  }

  indexDocument(browserAgent, indexName): any {
    return this.client.index({
      index: indexName,
      type: 'browserAgent',
      body: {
        browserAgent: browserAgent,
        publishedDate: new Date()
      }
    });
  }

  search(event, index, sortField, sortOrder, pageIndex = 0, pageSize = 5): any {
    const pageOffset = (pageIndex) * pageSize;
    return this.client.search({
      index: index,
      body: {
        from: pageOffset,
        size: pageSize,
        sort: [
          {
            [sortField]: {
              order: sortOrder
            }
          }
        ],
        query: {
          bool: {
            must: {
              match: {
                browserAgent: {
                  query: event,
                  minimum_should_match: '30%'
                }
              }
            },
            should: {
              match_phrase: {
                browserAgent: {
                  query: event,
                  slop: 50
                }
              }
            }
          }
        }
      }
    });
  }

  getAllSearchDocuments(event, index) {
    return this.client.search({
      index: index,
      body: {
        query: {
          bool: {
            must: {
              match: {
                browserAgent: {
                  query: event,
                  minimum_should_match: '30%'
                }
              }
            },
            should: {
              match_phrase: {
                browserAgent: {
                  query: event,
                  slop: 50
                }
              }
            }
          }
        }
      }
    });
  }

  getAllDocuments(index): any {
    return this.client.search({
      index: index,
      body: {
        query: {
          match_all: {}
        }
      }
    });
  }

  getAllDocumentsPaginated(index, sortField, sortOrder, pageIndex = 0, pageSize = 5): any {
    const pageOffset = (pageIndex) * pageSize;
    return this.client.search({
      index: index,
      body: {
        from: pageOffset,
        size: pageSize,
        sort: [
          {
            [sortField]: {
              order: sortOrder
            }
          }
        ],
        query: {
          match_all: {}
        }
      }
    });
  }

  isAvailable(): any {
    return this.client.ping({
      requestTimeout: Infinity,
      body: 'Elastic Search available!'
    });
  }
}
