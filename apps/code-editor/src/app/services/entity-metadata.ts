import { DefaultDataServiceConfig, EntityMetadataMap } from '@ngrx/data';

const appEntityMetadata: EntityMetadataMap = {
  Chapter: {},
};

const pluralNames = {
  Chapter: 'Chapters',
};

export const entityConfig = {
  appEntityMetadata,
  pluralNames,
};

export const defaultDataServiceConfig: DefaultDataServiceConfig = {
  root: 'http://localhost:3000/chapters',
};
