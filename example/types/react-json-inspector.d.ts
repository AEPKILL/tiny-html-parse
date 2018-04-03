declare module 'react-json-inspector' {
  import * as React from 'react';
  class Inspector extends React.Component<{
    data: any;
    search?: boolean;
  }> {}
  export default Inspector;
}
