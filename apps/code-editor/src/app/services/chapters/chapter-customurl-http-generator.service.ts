import {
  DefaultHttpUrlGenerator,
  HttpResourceUrls,
  Pluralizer,
} from '@ngrx/data';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

// the facade entity service
@Injectable()
export class ChapterCustomurlHttpGenerator extends DefaultHttpUrlGenerator {
  constructor(pluralizer: Pluralizer) {
    super(pluralizer);
  }

  override getResourceUrls(
    entityName: string,
    root: string,
    trailingSlashEndpoints?: boolean
  ): HttpResourceUrls {
    let resourcesUrls = this.knownHttpResourceUrls[entityName];
    if (
      entityName === 'Chapter' &&
      environment.backendService === 'json-server'
    ) {
      resourcesUrls = {
        entityResourceUrl: `http://localhost:3000/chapters/`,
        collectionResourceUrl: `http://localhost:3000/chapters/`,
      };
      this.registerHttpResourceUrls({ [entityName]: resourcesUrls });
    } else {
      resourcesUrls = {
        entityResourceUrl: `${root}/${entityName}/`,
        collectionResourceUrl: `${root}/${entityName}/`,
      };
      this.registerHttpResourceUrls({ [entityName]: resourcesUrls });
    }
    return resourcesUrls;
  }
}
