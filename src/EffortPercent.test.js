import React from 'react';
import ReactDOM from 'react-dom';
import EffortPercent from './EffortPercent';
import renderer from 'react-test-renderer';

// smoke test
it('renders <EffortPercent /> component without crashing, smoke test', () => {
  const div = document.createElement('div'); 
  ReactDOM.render(<EffortPercent auth='true' />, div);
});

// snapshot test
it('renders correctly on snapshot test', () => {
  const tree = renderer.create(<EffortPercent auth="true" />).toJSON();
  expect(tree).toMatchSnapshot();
});