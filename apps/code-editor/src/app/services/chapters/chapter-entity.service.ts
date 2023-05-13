import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Chapter } from '@game/data-access/code-editor-data';
import { Injectable } from '@angular/core';

// the facade entity service
@Injectable()
export class ChapterEntityService extends EntityCollectionServiceBase<Chapter> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Chapter', serviceElementsFactory);
  }
}
