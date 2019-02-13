import React from "react";
import { Redirect } from "react-router-dom";
import { Button, Paper, Typography } from "@material-ui/core";
import { SpinLoader } from ".";

import secret from "../secret.json";

class Vote extends React.Component {
  constructor(props) {
    console.log(secret);
    super(props);
    const { match } = this.props;
    this.id = match.params.id;
    this.getQuestion.bind(this);
    this.state = { doneLoading: false, votingDisabled: false };
    this.renderButtons.bind(this);
    this._handleClick.bind(this);
  }
  async componentDidMount() {
    await this.getQuestion(this.id);
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

    this.setState({ options: json.payload[0].options });
    this.setState({ question: json.payload[0].question });
    this.setState({ doneLoading: true });
    return { ok: true };
  }

  async _handleClick(index) {
    this.setState({ votingDisabled: true });
    var result = await fetch(
      "https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/7cb5b3ddcb53cef0f88089689303ace98f75bf7ddf8c1eed6bc70f10a42d550f/submit-vote/",
      {
        body: `{"id":${this.id},"index": ${index}}`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Ibm-Client-Id":  secret.SUBMIT_VOTE
        },
        method: "POST"
      }
    );
    const json = await result.json();
    console.log(json);
    if (!json.success) {
      return { error: "Json Error" };
    }
    this.setState({ votingDisabled: false });
  }

  renderButtons() {
    const self = this;
    return this.state.options.map(function(option, index) {
      return (
        <div key={index}>
          <Button
            variant="contained"
            color="primary"
            disabled={self.state.votingDisabled}
            style={{ marginBottom: 10, width: "90%" }}
            onClick={() => self._handleClick(index)}
          >
            {option}
          </Button>
        </div>
      );
    });
  }

  render() {
    if (!this.state.doneLoading) {
      return <SpinLoader />;
    }
    if (this.state.viewVotes) {
      return (
        <Redirect
          to={{
            pathname: `/${this.id}/view`,
            state: { id: this.id }
          }}
        />
      );
    }

    if (this.state.goBack) {
      return (
        <Redirect
          to={{
            pathname: "/"
          }}
        />
      );
    }
    return (
      <div
        style={{
          width: "100%"
        }}
      >
        <center>
          <Paper elevation={4} style={{ marginBottom: 10 }}>
            <Typography variant="h3" component="h3">
              Question
            </Typography>
            <Typography variant="h6">{this.state.question}</Typography>
          </Paper>
          {this.renderButtons()}
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: 50, width: "90%" }}
            onClick={() => this.setState({ viewVotes: true })}
          >
            WATCH THE VOTES
          </Button>

          <Button
            variant="contained"
            color="secondary"
            style={{ marginTop: 50, width: "90%" }}
            onClick={() => this.setState({ goBack: true })}
          >
            Go to Home
          </Button>
        </center>
      </div>
    );
  }
}

export { Vote };
