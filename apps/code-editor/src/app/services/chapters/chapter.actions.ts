import { createAction, props } from '@ngrx/store';
// TODO: not in use, but could be useful in the future
export const selectChapter = createAction(
  '[Chapter Page] Select Chapter',
  props<{ chapterId: string }>()
);
