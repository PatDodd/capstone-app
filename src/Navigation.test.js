import React from 'react';
import ReactDOM from 'react-dom';
import Navigation from './Navigation';
import renderer from 'react-test-renderer';

// smoke test
it('renders <Navigation /> component without crashing, smoke test', () => {
  const div = document.createElement('div'); 
  ReactDOM.render(<Navigation />, div);
});

// snapshot test
it('renders correctly on snapshot test', () => {
  const tree = renderer.create(<Navigation />).toJSON();
  expect(tree).toMatchSnapshot();
});