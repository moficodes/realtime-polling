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

* If everything else worked, we should be able to now be able to search for our question that we created.
* Type in the ID and press enter.
* For the question we created the ID was "001"

![](../.gitbook/assets/image%20%288%29.png)

* Open a new browser window, go to the question again then go to `Watch The Votes` , you will see a bar graph of the question and the options. Vote on one of the screen, you can see the numbers rise on the other screen. 

![](../.gitbook/assets/image%20%286%29.png)

* And with that the application is done. 

But wait I did promise you we will do that with twilio too. 

Lets do that in the next section.

