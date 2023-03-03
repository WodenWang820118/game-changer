// utility modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgScrollbarModule } from 'ngx-scrollbar';

// standard/standalone components
import { AppComponent } from './app.component';
import { EditorComponent } from './components/editor/editor.component';
import { RendererComponent } from './components/renderer/renderer.component';
import { PlayButtonComponent } from './components/play-button/play-button.component';
import { EditorConsoleComponent } from './components/editor-console/editor-console.component';
import { SidebarNavComponent } from './components/sidebar/sidebar.component';
import { ChapterComponent } from './components/chapter/chapter.component';

// directives
import { ResizableDirective } from './resizable.directive';

// services
import { EditorService } from '../services/editor.service';

@NgModule({
  declarations: [AppComponent, ResizableDirective],
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
  ],
  providers: [EditorService],
  bootstrap: [AppComponent],
})
export class AppModule {}
