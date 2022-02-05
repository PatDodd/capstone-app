import React from 'react';
import ReactDOM from 'react-dom';
import Stats from './Stats';
import renderer from 'react-test-renderer';

// smoke test
it('renders <Stats /> component without crashing, smoke test', () => {
  const div = document.createElement('div'); 
  ReactDOM.render(<Stats />, div);
});

// snapshot test
it('renders correctly on snapshot test', () => {
    const tree = renderer.create(<Stats />).toJSON();
    expect(tree).toMatchSnapshot();
});