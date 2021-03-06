/* NOTE
  all one-line star comments starting with "eslint", "global", or "NOTE"
  will be removed before displaying this document to the user
*/
/* global React, ReactDOM, App, mountNode, location, _ */
/* global Area, VictoryArea, VictoryAxis, VictoryChart, VictoryLine */
/* eslint-disable no-bitwise */

// Victory requires `react@^15.5.0` and `prop-types@^15.5.0`

// This customized component is supplied to VictoryArea
class GradientArea extends Area {
  toGrayscale(color) {
    const integerColor = parseInt(color.replace("#", ""), 16);
    const r = (integerColor >> 16) & 255;
    const g = (integerColor >> 8) & 255;
    const b = integerColor & 255;
    const gray = parseInt(0.299 * r + 0.587 * g + 0.114 * b, 10);
    return `rgb(${gray}, ${gray}, ${gray})`;
  }

  // This method exists in Area, and is completely overridden for the custom component.
  renderArea(paths, style, events) {
    const gradientId = `gradient-${Math.random()}`;
    const areaStyle = Object.assign(
      {}, style, {fill: `url(${location.href}#${gradientId})`}
    );
    const percent = `${this.props.percent}%`;
    const gray = this.toGrayscale(style.fill);
    return paths.map((path, index) => {
      return (
        <g key={index}>
          <defs>
            <linearGradient id={gradientId}>
                <stop offset="0%" stopColor={style.fill}/>
                <stop offset={percent} stopColor={style.fill}/>
                <stop offset={percent} stopColor={gray}/>
                <stop offset="100%" stopColor={gray}/>
            </linearGradient>
          </defs>
          <path key="area" style={areaStyle} d={path} {...events}/>
        </g>
      );
    });
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      // Imagine tying this to some UI control instead
      percent: _.random(30, 80)
    };
  }

  // This data is manipulated to approximate a stream. Victory doesn't yet have a stream layout,
  // so for now you would compute the appropriate y and y0.
  // Adding a stream layout to Victory would only be ~ a day of work.
  getStreamData() {
    return _.range(7).map((i) => {
      return _.range(26).map((j) => {
        return {
          x: j,
          y: (10 - i) * _.random(10 - i, 20 - 2 * i),
          _y0: -1 * (10 - i) * _.random(10 - i, 20 - 2 * i)
        };
      });
    });
  }

  render() {
    const style = {
      parent: {border: "1px solid #ccc", margin: "2%"}
    };

    const streamData = this.getStreamData();

    const colors = [
      "#006064", "#00796B", "#8BC34A", "#DCE775",
      "#FFF59D", "#F4511E", "#c33409"
    ];

    return (
      <div>
        <VictoryChart
          style={style}
          domain={{x: [0, 25], y: [-300, 300]}}
        >
          <VictoryAxis
            style={{
              axis: {stroke: "none"},
              ticks: {stroke: "none"},
              tickLabels: {fill: "none"},
              grid: {stroke: "gray"}
            }}
            tickCount={20}
          />
          <VictoryAxis dependentAxis
            style={{
              ticks: {stroke: "gray"},
              tickLabels: {fill: "gray", fontSize: 12}
            }}
            crossAxis={false}
          />

          {
            streamData.map((d, i) => {
              return (
                <VictoryArea key={i}
                  interpolation="monotoneX"
                  data={d}
                  style={{data: {fill: colors[i]}}}
                  dataComponent={
                    <GradientArea percent={this.state.percent}/>
                  }
                />
              );
            })
          }
          <VictoryLine
            style={{
              data: {stroke: "#c33409", strokeWidth: 3}
            }}
            data={[
              {x: 25 * this.state.percent / 100, y: -300},
              {x: 25 * this.state.percent / 100, y: 300}
            ]}
          />
        </VictoryChart>
      </div>
    );
  }
}

ReactDOM.render(<App/>, mountNode);
