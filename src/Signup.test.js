import React from 'react';
import ReactDOM from 'react-dom';
import Signup from './Signup';
import renderer from 'react-test-renderer';

// smoke test
it('renders <Signup /> component without crashing, smoke test', () => {
  const div = document.createElement('div'); 
  ReactDOM.render(<Signup />, div);
});

// snapshot test
it('renders correctly on snapshot test', () => {
  const tree = renderer.create(<Signup />).toJSON();
  expect(tree).toMatchSnapshot();
});