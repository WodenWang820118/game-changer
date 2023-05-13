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
import { MatIconModule } from '@angular/material/icon';

// standard/standalone components
import { AppComponent } from './app.component';
import { EditorComponent } from './components/editor/editor.component';
import { RendererComponent } from './components/renderer/renderer.component';
import { PlayButtonComponent } from './components/play-button/play-button.component';
import { EditorConsoleComponent } from './components/editor-console/editor-console.component';
import { SidebarNavComponent } from './components/sidebar/sidebar.component';
import { ChapterComponent } from './components/chapter/chapter.component';
import { MenuComponent } from './components/menu/menu.component';
import { TabletViewportSwitchesComponent } from './components/tablet-switches/tablet-viewport-switches.component';
import { EditorViewportComponent } from './components/editor/editor-viewport/editor-viewport.component';
import { RendererViewportComponent } from './components/renderer/renderer-viewport/renderer-viewport.component';

// directives
import { ResizableDirective } from './directives/resizable.directive';
import { ConsoleInteractDirective } from './directives/console-interact.directive';
import { MenuItemLinkDirective } from './directives/menu-item-link.directive';

// services
import { EditorService } from './services/editor/editor.service';
import { ChaptersDataService } from './services/chapters/chapters.data.service';
import { ChapterResolver } from './services/chapters/chapter.resolver';
import { ChapterEntityService } from './services/chapters/chapter-entity.service';
import { ChapterCustomurlHttpGenerator } from './services/chapters/chapter-customurl-http-generator.service';

// ngrx
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EntityDataModule, HttpUrlGenerator } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import {
  EntityDataService,
  EntityDefinitionService,
  DefaultDataServiceFactory,
} from '@ngrx/data';
import { metaReducers, reducers } from './reducers';
import { entityConfig } from './services/entity-metadata';

// others
import { environment } from '../environments/environment';

// feature modules
import { DataAccessCodeEditorDataModule } from '@game/data-access/code-editor-data';
import { DataAccessAuthenticationModule } from '@game/data-access/authentication';
import { DataAccessUserModule } from '@game/data-access/user';

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
    MenuComponent,
    TabletViewportSwitchesComponent,
    EditorViewportComponent,
    RendererViewportComponent,
    NgScrollbarModule,
    HttpClientModule,
    MatIconModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
    ResizableDirective,
    ConsoleInteractDirective,
    EffectsModule.forRoot([]),
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
    EntityDataModule.forRoot(entityConfig),
    RouterModule.forRoot(chapterRoutes),
    DataAccessCodeEditorDataModule,
    DataAccessAuthenticationModule,
    DataAccessUserModule,
    MenuItemLinkDirective,
  ],
  providers: [
    EditorService,
    EntityDataService,
    DefaultDataServiceFactory,
    EntityDefinitionService,
    ChapterEntityService,
    ChaptersDataService,
    ChapterResolver,
    { provide: HttpUrlGenerator, useClass: ChapterCustomurlHttpGenerator },
    { provide: 'FIREBASE_CONFIG', useValue: environment.firebaseConfig },
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
