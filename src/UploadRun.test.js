import React from 'react';
import ReactDOM from 'react-dom';
import UploadRun from './UploadRun';
import renderer from 'react-test-renderer';

// smoke test
it('renders <UploadRun /> component without crashing, smoke test', () => {
  const div = document.createElement('div'); 
  ReactDOM.render(<UploadRun />, div);
});

// snapshot test
it('renders correctly on snapshot test', () => {
  const tree = renderer.create(<UploadRun />).toJSON();
  expect(tree).toMatchSnapshot();
});