import React from 'react';
import ReactDOM from 'react-dom';
import EffPercGraph from './EffPercGraph';
import renderer from 'react-test-renderer';

 
const data = [
    {
        activityDate: "Mon Sep 17 2018 10:48:50 GMT-0700 (Pacific Daylight Time)",
        activityDescription: "",
        activityGear: "",
        activityID: "1848411911",
        activityName: "Runny McRunnerson",
        activityType: "Run",
        averagePace: 683.0419222078668,
        averagePaceMinutes: 11,
        averagePaceSeconds: 23,
        commute: "FALSE",
        distance: 1.88275413,
        elapsedTime: 1286,
        filename: "activities/1848411911.gpx",
        relativeEffort: ""
    },

    {
        activityDate: "Fri Nov 02 2018 12:05:46 GMT-0700 (Pacific Daylight Time)",
        activityDescription: "",
        activityGear: "",
        activityID: "1941925768",
        activityName: "RwR",
        activityType: "Run",
        averagePace: 765.7050698205537,
        averagePaceMinutes: 12,
        averagePaceSeconds: 45,
        commute: "FALSE",
        distance: 2.56626223,
        elapsedTime: 1965,
        filename: "activities/1941925768.gpx",
        relativeEffort: ""
    },
    {
        activityDate: "Sun Nov 04 2018 12:09:15 GMT-0800 (Pacific Standard Time)",
        activityDescription: "",
        activityGear: "",
        activityID: "1946458033",
        activityName: "wRw",
        activityType: "Run",
        averagePace: 756.3145416778752,
        averagePaceMinutes: 12,
        averagePaceSeconds: 36,
        commute: "FALSE",
        distance: 2.58490336,
        elapsedTime: 1955,
        filename: "activities/1946458033.gpx",
        relativeEffort: ""
    },

    {
        activityDate: "Mon Nov 05 2018 11:24:22 GMT-0800 (Pacific Standard Time)",
        activityDescription: "",
        activityGear: "",
        activityID: "1948029229",
        activityName: "wRw",
        activityType: "Run",
        averagePace: 821.5886541798116,
        averagePaceMinutes: 13,
        averagePaceSeconds: 41,
        commute: "FALSE",
        distance: 2.18722592,
        elapsedTime: 1797,
        filename: "activities/1948029229.gpx",
        relativeEffort: ""
    }
];

const to = "9/17/2018";
const from ="11/5/2018";

it('renders <EffPerceGraph /> component without crashing, smoke test', () => {
  const div = document.createElement('div'); 
  ReactDOM.render(<EffPercGraph data={data} to={to} from={from} />, div);
});

// snapshot test
it('renders correctly on snapshot test', () => {
    const tree = renderer.create(<EffPercGraph data={data} to={to} from={from} />).toJSON();
    expect(tree).toMatchSnapshot();
});