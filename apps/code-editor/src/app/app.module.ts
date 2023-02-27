import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { EditorComponent } from './components/editor/editor.component';
import { RendererComponent } from './components/renderer/renderer.component';
import { PlayButtonComponent } from './components/play-button/play-button.component';
import { ResizableDirective } from './resizable.directive';

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
  ],
  providers: [EditorService],
  bootstrap: [AppComponent],
})
export class AppModule {}
