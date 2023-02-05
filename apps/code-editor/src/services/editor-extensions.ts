import { basicSetup } from 'codemirror';
import { Compartment, EditorState } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';

import {
  indentWithTab,
  history,
  defaultKeymap,
  historyKeymap,
} from '@codemirror/commands';
import { oneDark } from '../themes/one-dark';

const commonExtensions = [
  basicSetup,
  keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
  oneDark,
  history(),
  new Compartment().of(EditorState.tabSize.of(2)),
];

export const htmlEditorExtensions = [...commonExtensions, html()];

export const cssEditorExtensions = [...commonExtensions, css()];

export const jsEditorExtensions = [...commonExtensions, javascript()];
