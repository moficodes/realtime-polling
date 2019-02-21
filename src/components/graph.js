import React from "react";
import PubNub from "pubnub";
import { Button } from "@material-ui/core";
import { Redirect } from "react-router-dom";

import {
  Chart,
  Bars,
  Animate,
  Layer,
  Ticks,
  Labels,
  Transform,
  Title
} from "rumble-charts";

import { SpinLoader } from ".";

import secret from "../secret.json";
class Graph extends React.Component {
  pubnub = new PubNub({
    subscribeKey: secret.SUBSCRIBE_KEY,
    publishKey: secret.PUBLISH_KEY,
    secretKey: secret.SECRET_KEY,
    ssl: true
  });
  constructor(props) {
    super(props);
    const { match } = this.props;
    this.id = match.params.id;
    this.state = {
      series: [],
      width: window.innerWidth,
      height: window.innerHeight - 60,
      doneLoading: false
    };

    this.getQuestion.bind(this);
    this.getVotes.bind(this);
  }

  async componentDidMount() {
    window.addEventListener("resize", this.updateWindowDimensions);
    var question = await this.getQuestion(this.id);
    console.log(question);
    if (!question.ok) {
      this.setState({notFound: true})
    }
    await this.getVotes(this.id);
    const self = this;
    this.pubnub.addListener({
      message: function(message) {
        // handle message
        let index = message.message.index;
        var series = self.state.series;
        series[index]["data"][0] = series[index]["data"][0] + 1;
        self.setState(series);
      }
    });

    this.pubnub.subscribe({
      channels: ["channel-" + this.id]
    });
  }

  async getVotes(id) {
    var result = await fetch(
      "https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/7cb5b3ddcb53cef0f88089689303ace98f75bf7ddf8c1eed6bc70f10a42d550f/get-votes/?id=" +
        id,
      {
        headers: {
          Accept: "application/json",
          "X-Ibm-Client-Id": secret.GET_VOTES
        }
      }
    );

    const json = await result.json();
    if (!json.ok) {
      return { error: json.error };
    }

    // console.log(json);

    var uniqs = json.payload.reduce((acc, val) => {
      acc[val.index] = acc[val.index] === undefined ? 1 : (acc[val.index] += 1);
      return acc;
    }, {});

    var data = this.state.series;

    data.map(function(key, index) {
      key.data[0] = uniqs[index];
      return null;
    });

    this.setState({ series: data });
    return { ok : true }
  }

  async getQuestion(id) {
    const result = await fetch(
      "https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/7cb5b3ddcb53cef0f88089689303ace98f75bf7ddf8c1eed6bc70f10a42d550f/get-quesiton/?id=" +
        id,
      {
        headers: {
          Accept: "application/json",
          "X-Ibm-Client-Id": secret.GET_QUESTION
        }
      }
    );
    const json = await result.json();

    if (!json.ok) {
      return { error: json.error };
    }

    let data = [];
    data = json.payload[0].options.map(function(key, index) {
      return {
        name: key,
        data: [0]
      };
    });
    this.setState({ series: data });
    this.setState({ question: json.payload[0].question });
    this.setState({ doneLoading: true });

    return { ok: true };
  }

  componentWillUnmount() {
    // clearInterval(this.timer);
    window.removeEventListener("resize", this.updateWindowDimensions);

    this.pubnub.unsubscribe({
      channels: ["channel-" + this.id]
    });
    return {ok: true}
  }

  updateWindowDimensions = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight - 60
    });
  };

  onClickHandler = () => {
    let index = Math.floor(Math.random() * this.state.series.length);
    var series = this.state.series;
    series[index]["data"][0] = series[index]["data"][0] + 1;
    this.setState(series);
  };

  render() {
    if(this.state.notFound) {
      return <Redirect to={`/not-found`}/>;
    }
    if (!this.state.doneLoading) {
      return <SpinLoader />;
    }
    if (this.state.vote) {
      return <Redirect to={`/${this.id}`} />;
    }
    return (
      <div>
        <Chart
          width={this.state.width}
          height={this.state.height}
          series={this.state.series}
          minY={0}
        >
          <Layer width="90%" height="90%">
            <Title
              position="top center"
              style={{ textAnchor: "middle", font: 30 }}
            >
              {this.state.question}
            </Title>
            <Layer widht="100%" height="80%">
              <Transform method="transpose">
                <Animate ease="linear">
                  <Ticks
                    axis="y"
                    lineLength="100%"
                    lineVisible={true}
                    lineStyle={{ stroke: "lightgray" }}
                    labelStyle={{
                      textAnchor: "end",
                      dominantBaseline: "middle",
                      fill: "lightgray"
                    }}
                    labelAttributes={{ x: -5 }}
                  />
                  <Bars
                    groupPadding="10%"
                    innerPadding="5%"
                    barAttributes={{
                      onMouseMove: e => (e.target.style.opacity = 1),
                      onMouseLeave: e => (e.target.style.opacity = 0.5)
                    }}
                    barStyle={{ opacity: 0.5 }}
                  />
                  <Labels
                    label={({ point }) => Math.round(point.y)}
                    dotStyle={{
                      alignmentBaseline: "before-edge",
                      textAnchor: "middle",
                      fontFamily: "sans-serif"
                    }}
                    labelAttributes={{ y: -20 }}
                  />

                  <Ticks
                    ticks={{ minDistance: 1 }}
                    axis="x"
                    label={({ index, props }) => this.state.series[index].name}
                    labelStyle={{
                      textAnchor: "middle",
                      dominantBaseline: "text-before-edge",
                      fill: "#485465"
                    }}
                    labelAttributes={{ y: 3 }}
                  />
                </Animate>
              </Transform>
            </Layer>
          </Layer>
        </Chart>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: 0, width: "100%" }}
          onClick={() => this.setState({ vote: true })}
        >
          VOTE SOME MORE
        </Button>
      </div>
    );
  }
}

export { Graph };
