import { Action, createReducer, on } from '@ngrx/store';
import { Chapter } from '@game/data-access/code-editor-data';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import * as ChapterActions from './chapter.actions';

// TODO: not in use, but could be useful in the future

export interface ChapterState extends EntityState<Chapter> {
  selectedChapterId: string;
}

export function selectChapterId(a: Chapter) {
  //In this case this would be optional since primary key is id
  return a.id;
}

export function sortByOrder(a: Chapter, b: Chapter): number {
  return a.order - b.order;
}

export const adapter: EntityAdapter<Chapter> = createEntityAdapter<Chapter>({
  selectId: selectChapterId,
  sortComparer: sortByOrder,
});

export const initialState: ChapterState = adapter.getInitialState({
  selectedChapterId: '1',
});

export const chapterReducer = createReducer(
  initialState,
  on(ChapterActions.selectChapter, (state, { chapterId }) => {
    return { ...state, selectedChapterId: chapterId };
  })
);

export function reducer(state: ChapterState, action: Action) {
  return chapterReducer(state, action);
}
