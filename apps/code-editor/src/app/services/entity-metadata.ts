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
