import React from "react";
import { Redirect } from "react-router-dom";
import { Button, Paper, Typography } from "@material-ui/core";
import { SpinLoader } from ".";

import secret from "../secret.json";

class Vote extends React.Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    this.id = match.params.id;
    this.getQuestion.bind(this);
    this.state = { doneLoading: false, votingDisabled: false };
    this.renderButtons.bind(this);
    this._handleClick.bind(this);
  }
  async componentDidMount() {
    var question = await this.getQuestion(this.id);
    if (!question.ok){
      this.setState({notFound: true});
    }
  }

  async getQuestion(id) {
    const result = await fetch(secret.GET_QUESTION_URL+id,
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
    const body = {
      id: this.id,
      index: index,
    };

    const jsonBody = JSON.stringify(body);
    var result = await fetch(secret.SUBMIT_VOTE_URL,
      {
        body: jsonBody,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Ibm-Client-Id":  secret.SUBMIT_VOTE,
          "X-Debug-Mode": true
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
    return {
      ok: true
    }
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
    if(this.state.notFound) {
      return <Redirect to={`/not-found`}/>;
    }
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
