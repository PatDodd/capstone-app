import React from 'react';
import ReactDOM from 'react-dom';
import Elevation from './Elevation';
import renderer from 'react-test-renderer';

it('renders <Elevation /> component without crashing, smoke test', () => {
  const div = document.createElement('div'); 
  ReactDOM.render(<Elevation />, div);
});

// snapshot test
it('renders correctly on snapshot test', () => {
    const tree = renderer.create(<Elevation />).toJSON();
    expect(tree).toMatchSnapshot();
});