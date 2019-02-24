# React

* In Setup you already should have the git repo cloned. Go into the `realtime-polling` folder that was cloned.

```bash
cd realtime-polling
```

* Copy the `secret.template.json` file to `secret.json`

```bash
cp src/secret.template.json src/secret.json
```

* This is what the `secret.json` file should contain

```yaml
{
  "SUBMIT_VOTE": "submit-vote-api-key",
  "SUBMIT_VOTE_URL": "submit-vote-api-url",
  "GET_QUESTION": "get-question-api-key",
  "GET_QUESTION_URL": "get-question-api-url",
  "GET_VOTES": "get-votes-api-key",
  "GET_VOTES_URL": "get-votes-api-url",
  "SUBSCRIBE_KEY": "pubnub-subscribe-key",
  "PUBLISH_KEY": "pubnub-publish-key",
  "SECRET_KEY": "pubnub-secret-key"
}
```

* We will complete this file later. But we need this to start the application.
* Install the application dependencies

```text
npm install
```

* Start the application server

```text
npm start
```

* You should see the application pop up in the browser at [http://localhost:3000](http://localhost:3000)

