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
}

export default class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      nodes: parseString(template),
      content: template
    };
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
  render() {
    return (
      <div className="tiny-html-parse">
        <div className="editor-wrapper">
          <MonacoEditor
            language="html"
            theme="vs-light"
            width="100%"
            height="100%"
            value={this.state.content}
            requireConfig={requireConfig}
            options={{ minimap: { enabled: false }, automaticLayout: true }}
            onChange={this.onChange}
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
