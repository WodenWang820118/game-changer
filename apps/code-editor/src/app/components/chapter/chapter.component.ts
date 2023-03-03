import { MatIconModule } from '@angular/material/icon';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'game-chapter',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="chapter">
      <div class="chapter__content" [innerHTML]="content"></div>
      <div class="chapter__control">
        <p>Next</p>
        <p><mat-icon class="chapter__icon">arrow_forward</mat-icon></p>
      </div>
    </div>
  `,
  styleUrls: ['../../../styles.scss'],
})
export class ChapterComponent {
  // TODO: use JSON to load the content
  content = `
    <p>
      Welcome to the Svelte tutorial. This will teach you everything you need to know to build fast, small web applications easily.
    </p>
    <p>
      You can also consult the API docs and the examples, or — if you're impatient to start hacking on your machine locally — the 60-second quickstart.
    </p>
    <h2>What is Svelte?</h2>
    <p>
      Svelte is a tool for building fast web applications.
    </p>
    <p>It is similar to JavaScript frameworks such as React and Vue, which share a goal of making it easy to build slick interactive user interfaces.</p>
    <p>But there's a crucial difference: Svelte converts your app into ideal JavaScript at build time, rather than interpreting your application code at run time. This means you don't pay the performance cost of the framework's abstractions, and you don't incur a penalty when your app first loads.</p>
    <p>You can build your entire app with Svelte, or you can add it incrementally to an existing codebase. You can also ship components as standalone packages that work anywhere, without the overhead of a dependency on a conventional framework.</p>
    <h2>How to use this tutorial?</h2>
    <p>You'll need to have basic familiarity with HTML, CSS and JavaScript to understand Svelte.</p>
    <p>As you progress through the tutorial, you'll be presented with mini exercises designed to illustrate new features. Later chapters build on the knowledge gained in earlier ones, so it's recommended that you go from start to finish. If necessary, you can navigate via the dropdown above (click 'Introduction / Basics').</p>
    <p>Each tutorial chapter will have a 'Show me' button that you can click if you get stuck following the instructions. Try not to rely on it too much; you will learn faster by figuring out where to put each suggested code block and manually typing it into the editor.</p>
    <h2>Understanding components</h2>
    <p>In Svelte, an application is composed from one or more components. A component is a reusable self-contained block of code that encapsulates HTML, CSS and JavaScript that belong together, written into a .svelte file. The 'hello world' example in the code editor is a simple component.</p>
    `;
}
