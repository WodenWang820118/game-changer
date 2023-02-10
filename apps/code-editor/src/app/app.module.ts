import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { EditorComponent } from './components/editor/editor.component';
import { RendererComponent } from './components/renderer/renderer.component';
import { PlayButtonComponent } from './components/play-button/play-button.component';

import { EditorService } from '../services/editor.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    EditorComponent,
    RendererComponent,
    PlayButtonComponent,
  ],
  providers: [EditorService],
  bootstrap: [AppComponent],
})
export class AppModule {}
