import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import App from './App';

// smoke test
it('renders <App /> component without crashing, smoke test', () => {
  const div = document.createElement('div'); 
  ReactDOM.render(<App />, div);
});

// snapshot test
it('renders correctly on snapshot test', () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});

