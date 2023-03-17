import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';

// global state interface
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppState {}

// reducers
export const reducers: ActionReducerMap<AppState> = {};

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
