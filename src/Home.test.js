import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home';
import renderer from 'react-test-renderer';

it('renders <Home /> component without crashing, smoke test', () => {
  const div = document.createElement('div'); 
  ReactDOM.render(<Home />, div);
});

// snapshot test
it('renders correctly on snapshot test', () => {
  const tree = renderer.create(<Home />).toJSON();
  expect(tree).toMatchSnapshot();
});