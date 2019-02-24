# Putting It All Together

* In the src folder of the application, there is a file called `secret.template.json` , copy the file and save it as `secret.json` . 
* The content of the `secret.json` file is as follows

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

* Replace the data with data collected on the previous steps.

{% hint style="info" %}
* If you are having trouble finding the PubNub keys take a look at the pubnub section of the Setup
* The URL and API keys we got in the previous step
{% endhint %}

* 
