import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import {
  ChapterState,
  chapterReducer,
} from '../services/chapters/chapter.reducers';

// global state interface
export interface AppState {
  chapters: ChapterState;
}

// reducers
export const reducers: ActionReducerMap<AppState> = {
  chapters: chapterReducer,
};

export function logger(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    console.log('state before: ', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

// only allow logger in development mode
export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [logger]
  : [];
