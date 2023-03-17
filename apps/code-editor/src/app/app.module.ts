// utility modules/components
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { HttpClientModule } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

// standard/standalone components
import { AppComponent } from './app.component';
import { EditorComponent } from './components/editor/editor.component';
import { RendererComponent } from './components/renderer/renderer.component';
import { PlayButtonComponent } from './components/play-button/play-button.component';
import { EditorConsoleComponent } from './components/editor-console/editor-console.component';
import { SidebarNavComponent } from './components/sidebar/sidebar.component';
import { ChapterComponent } from './components/chapter/chapter.component';

// directives
import { ResizableDirective } from './directives/resizable.directive';
import { ConsoleInteractDirective } from './directives/console-interact.directive';

// services
import { EditorService } from './services/editor.service';
import { ChaptersDataService } from './services/chapters.data.service';
import { ChapterResolver } from './services/chapter.resolver';
import { ChapterEntityService } from './services/chapter-entity.service';

// ngrx
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DefaultDataServiceConfig, EntityDataModule } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import {
  EntityDataService,
  EntityDefinitionService,
  DefaultDataServiceFactory,
} from '@ngrx/data';
import { metaReducers, reducers } from './reducers';
import {
  entityConfig,
  defaultDataServiceConfig,
} from './services/entity-metadata';

// others
import { environment } from '../environments/environment';

const chapterRoutes: Routes = [
  {
    path: '',
    component: AppComponent,
    resolve: {
      chapters: ChapterResolver,
    },
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    EditorComponent,
    RendererComponent,
    PlayButtonComponent,
    MatTabsModule,
    BrowserAnimationsModule,
    EditorConsoleComponent,
    SidebarNavComponent,
    ChapterComponent,
    NgScrollbarModule,
    HttpClientModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
    ResizableDirective,
    ConsoleInteractDirective,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionSerializability: true,
        strictStateSerializability: true,
      },
    }),
    StoreModule.forFeature('chapters', reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([]),
    EntityDataModule.forRoot(entityConfig),
    RouterModule.forRoot(chapterRoutes),
  ],
  providers: [
    EditorService,
    EntityDataService,
    DefaultDataServiceFactory,
    EntityDefinitionService,
    ChapterEntityService,
    ChaptersDataService,
    ChapterResolver,
    { provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private eds: EntityDefinitionService,
    private entityDataService: EntityDataService,
    private chapterDataService: ChaptersDataService
  ) {
    this.eds.registerMetadataMap(entityConfig.appEntityMetadata);
    this.entityDataService.registerService('Chapter', this.chapterDataService);
  }
}
