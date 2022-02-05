import React from 'react';
import ReactDOM from 'react-dom';
import Pace from './Pace';
import renderer from 'react-test-renderer';

// smoke test
it('renders <Pace /> component without crashing, smoke test', () => {
  const div = document.createElement('div'); 
  ReactDOM.render(<Pace />, div);
});

// snapshot test
it('renders correctly on snapshot test', () => {
  const tree = renderer.create(<Pace />).toJSON();
  expect(tree).toMatchSnapshot();
});