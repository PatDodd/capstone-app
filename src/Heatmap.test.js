import React from 'react';
import ReactDOM from 'react-dom';
import Heatmap from './Heatmap';
import renderer from 'react-test-renderer';

// set up spy for scrollto to keep it from throwing errors to console during testing
global.scrollTo = jest.fn(); 

it('renders <Heatmap /> component without crashing, smoke test', () => {
  const div = document.createElement('div'); 
  ReactDOM.render(<Heatmap auth='true' />, div);
});

// snapshot test
it('renders correctly on snapshot test', () => {
    const tree = renderer.create(<Heatmap />).toJSON();
    expect(tree).toMatchSnapshot();
});