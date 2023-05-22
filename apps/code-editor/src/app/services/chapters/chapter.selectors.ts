import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromChapter from './chapter.reducers';

// TODO: not in use, but could be useful in the future

export const selectChapterState =
  createFeatureSelector<fromChapter.ChapterState>('chapters');

export const {
  selectIds: selectChapterIds,
  selectEntities: selectChapterEntities,
  selectAll: selectAllChapters,
  selectTotal: selectTotalChapters,
} = fromChapter.adapter.getSelectors(selectChapterState);

export const selectCurrentChapterId = createSelector(
  selectChapterState,
  (state: fromChapter.ChapterState) => state.selectedChapterId
);

export const selectCurrentChapter = createSelector(
  selectChapterEntities,
  selectCurrentChapterId,
  (chapterEntities, chapterId) => chapterEntities[chapterId]
);
