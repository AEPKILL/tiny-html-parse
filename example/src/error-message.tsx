import * as React from 'react';
import ParseError from '../../src/parse/parse-error';

export interface ErrorMessageProps {
  error?: ParseError;
}
export default class ErrorMessage extends React.Component<
  ErrorMessageProps,
  ErrorMessageProps
> {
  render() {
    const show = !!this.props.error;
    const className = `error-message${show ? ' show' : ' hide'}`;
    return (
      <div className={className}>
        {show ? `tiny-html-parse error: ${this.props.error!.message}` : ''}
      </div>
    );
  }
}
