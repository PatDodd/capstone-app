import React from 'react';
import ReactDOM from 'react-dom';
import GetData from './GetData';
import renderer from 'react-test-renderer';

// smoke test
it('renders <GetData /> component without crashing, smoke test', () => {
  const div = document.createElement('div'); 
  ReactDOM.render(<GetData />, div);
});

// snapshot test
it('renders correctly on snapshot test', () => {
  const tree = renderer.create(<GetData />).toJSON();
  expect(tree).toMatchSnapshot();
});