import * as React from 'react';
import Inspector from 'react-json-inspector';
import MonacoEditor from 'react-monaco-editor';
import parseString from '../../src/parse/index';
import ParseError from '../../src/parse/parse-error';
import TinyHtmlNode from '../../src/tiny-html-node';
import ErrorMessage from './error-message';

import './app.css';
import './style/json-inspector.css';

const requireConfig = {
  url: './vs/loader.js',
  paths: {
    vs: './vs'
  }
};

const template = `<div id="main">it's tiny html parse</div>`;

interface AppState {
  nodes: TinyHtmlNode[];
  error?: ParseError;
  content: string;
  editorLoaded: boolean;
}

export default class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      nodes: parseString(template),
      content: template,
      editorLoaded: false
    };
    this.onChange = this.onChange.bind(this);
    this.onEditorLoaded = this.onEditorLoaded.bind(this);
  }
  onChange(content: string) {
    this.setState({ content });
    try {
      const nodes = parseString(content, { skipWhitespace: true });
      this.setState({ nodes, error: undefined });
    } catch (e) {
      this.setState({ error: e, nodes: [] });
    }
  }
  onEditorLoaded() {
    this.setState({ editorLoaded: true });
  }
  render() {
    const editorLoadTips = this.state.editorLoaded ? null : (
      <div className="editor-load-tips"> loading editor </div>
    );
    return (
      <div className="tiny-html-parse">
        <div className="editor-wrapper">
          {editorLoadTips}
          <MonacoEditor
            language="html"
            theme="vs-light"
            width="100%"
            height="100%"
            value={this.state.content}
            requireConfig={requireConfig}
            options={{ minimap: { enabled: false }, automaticLayout: true }}
            onChange={this.onChange}
            editorDidMount={this.onEditorLoaded}
          />
        </div>
        <div className="inspector-wrapper">
          <Inspector data={this.state.nodes} search={false} />
        </div>
        <ErrorMessage error={this.state.error} />
      </div>
    );
  }
}
