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
import { oneDark } from '../../themes/one-dark';

const commonExtensions = [
  basicSetup,
  keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
  history(),
  new Compartment().of(EditorState.tabSize.of(2)),
];

export const htmlDarkEditorExtensions = [...commonExtensions, oneDark, html()];

export const cssDarkEditorExtensions = [...commonExtensions, oneDark, css()];

export const jsDarkEditorExtensions = [
  ...commonExtensions,
  oneDark,
  javascript(),
];

export const htmlLightEditorExtensions = [...commonExtensions, html()];
export const cssLightEditorExtensions = [...commonExtensions, css()];
export const jsLightEditorExtensions = [...commonExtensions, javascript()];
