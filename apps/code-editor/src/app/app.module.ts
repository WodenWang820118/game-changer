// utility modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { HttpClientModule } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClient } from '@angular/common/http';

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
  ],
  providers: [EditorService],
  bootstrap: [AppComponent],
})
export class AppModule {}
