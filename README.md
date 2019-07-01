# Realtime Voting Application with Serverless Backend and Twilio

# Introduction

In this tutorial we will build a demo application that makes use of twilio, pubnub and serverless architecture to make a real time polling application that uses text messages as a means to collect answers from users.

# Prerequisites

To be able to follow along or complete this tutorial/workshop you need the following.
**Openwhisk**

- I would be using IBM Cloud Functions that uses Openwhisk.
  - [Sign up for IBM Cloud](https://ibm.biz/BdYan6)

**Or**

- [Openwhisk Local Installation](https://openwhisk.apache.org/documentation.html#openwhisk_deployment) for testing
  - For setting up openwhisk local you need
    - [docker](https://docs.docker.com/docker-for-mac/)
    - [docker-compose](https://docs.docker.com/docker-for-mac/)

**Prorgramming Language**
For this demo I am using **Node**. But with openwhisk you can write your functions in Node, Swift, Go, Python, Java, Ruby, Php and in the unlikely case none of the above is your language, you can create a docker image of your function and openwhisk will run that. So its safe to say openwhisk can run it all.
**Cloudant Database**
Lite version of CLoudant available from IBM Cloud.
**React**
For front end I am using React. This will be a very simple use of react. We wont go much deep into the use of reactjs in this workshop.
**Twilio**
Twilio is a messaging platform that we will make use of to collect votes. There are many other things twilio can do. Visit their website to find out more.
**PubNub**
The real time portion of the app depends on PubNub. PubNub gives us a publish and subscribe platform where we can get real time data streaming in our app.


# Estimated time

From end to end this would take 60-90 min.


# Steps
## App Flow
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZQZtZMf6aCsy18Xl9d%2F-LZQZxFJ_xbokscIygUY%2Fflow.png?alt=media&token=41558428-22f6-4df9-927c-1d427cf33385)


This is roughly how the app works.
**Create Question:**
Right now there is no UI for create question. We invoke the function directly to create a new question in the cloudant database.
**Get Question:**
Users query the database for a question with the id from the React UI. If the question exists they are taken to the question page.
**Submit Vote:**
User can then select a choice to vote for and Submit vote function is invoked. That sets the vote to the cloudant database and also publishes the vote to a pubnub channel that every one else is listening to. And would update the vote count in real time.
**Get All Vote:**
When users try to see the vote graphs, the first time we load up all the vote from the cloudant database. then start listening for any new vote.
**Handle Message:**
So our app works online. But can we make this work offline. Thats where twilio comes in. With twilio we will handle text messages sent to our app and respond appropriately.


## Setup

In this section, you will create your own IBM Cloud account, and then get access to a IBM Cloud Lab account which contains pre-provisioned clusters. Each lab attendee will be granted access to one cluster.

## Step 1: Create your IBM Cloud account

[Sign up for IBM Cloud](https://ibm.biz/Bd2Gpv)

## Step 2: Install IBM Cloud CLI

You use the [IBM Cloud CLI installer](https://console.bluemix.net/docs/cli/reference/ibmcloud/download_cli.html#install_use) or the OS-specific shell installers below.
[MacOS]
[Linux]
[Windows]

    curl -fsSL https://clis.ng.bluemix.net/install/osx | sh

Some windows user may see an error saying *"Exception calling "DownloadString" with "1" argument(s): "The underlying connection was closed: An unexpected error occurred on a send." At line:1 char:1"*  Its an issue with Powershell Mutual TLS Setting. Use installer found on the link right above.

## Step 3: Install IBM CLI Plugins

For the lab we will need a few plugins.

1. Cloud Functions
To install run the following in your terminal.

```ibmcloud plugin install cloud-functions```


## Step 4: Install Node NPM

Install node

https://nodejs.org/en/download/

## Step 5: Setup Cloud Function

IBM Cloud Functions should be setup with your account creation. 
If for some reason the cloud foundry space doesn't get created automatically, setup IBM Cloud Functions [https://github.com/jthomas/openwhisk-workshops/tree/master/bootcamp/ex0%20-%20setting%20up%20development%20environment](https://github.com/jthomas/openwhisk-workshops/tree/master/bootcamp/ex0%20-%20setting%20up%20development%20environment)
Okay, Finally we are ready to get started with the workshop. If something is still missing work through this thorough bootcamp step by step. [https://github.com/jthomas/openwhisk-workshops/tree/master/bootcamp](https://github.com/jthomas/openwhisk-workshops/tree/master/bootcamp)

## Step 6: Clone the repository

In this step, we'll clone the realtime-polling  git repository. This repository contains both the web application and code for our functions that we will deploy.

    git clone https://github.com/moficodes/realtime-polling.git

**Summary**
State any closing remarks about the task or goal you described and its importance. Reiterate specific benefits the reader can expect from completing your tutorial. Recommend a next step (with link if possible) where they can continue to expand their skills after completing your tutorial.
**Related links**
Include links to other resources that may be of interest to someone who is reading your tutorial.



## Step 6: PubNub
1. Go to [https://dashboard.pubnub.com/signup](https://dashboard.pubnub.com/signup) to sign up for a PubNub acc. Their Free Tier should give us enough for our project and to tinker.
2. Once you have signed up and logged in. You should then create a new App.
3. In your app create a new keyset. Key set has a `pubkey`, a `subkey` and a `secretkey`. We will need this information in future steps.


## Step 7: Cloudant Database

In this step we will create a lite cloudant database.

1. Log into [IBM Cloud Account](https://cloud.ibm.com/) 
2. Go to catalog in the top nav bar.
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZ6KCjOTL8aajib5Ovt%2F-LZ7H1ZklrkG0rM4HEYE%2FScreen%20Shot%202019-02-19%20at%207.21.28%20PM.png?alt=media&token=0169dce9-5ad5-45bb-96fb-f4c754294ae3)


3. Search for cloudant in the text box.
4. Select Cloudant from the result.

![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZ6KCjOTL8aajib5Ovt%2F-LZ7HTDLRQ3BT3nzetdY%2FScreen%20Shot%202019-02-19%20at%207.23.15%20PM.png?alt=media&token=1be935e6-9536-4dc7-8cb2-ae2b1d9dd6df)


5. Select a name for the service and for **authentication methods** select `Use both legacy credentials and IAM`

![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZ6KCjOTL8aajib5Ovt%2F-LZ7I2mTIJKN5lnisVje%2FScreen%20Shot%202019-02-19%20at%207.25.29%20PM.png?alt=media&token=a7cd693f-2748-4051-9b19-c91f346f19c2)


6. Once the db is loaded go to service credential. You can always come back to this page from your account dashboard.

![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZ6KCjOTL8aajib5Ovt%2F-LZ7ITV5gyGlpjOYJXIS%2FScreen%20Shot%202019-02-19%20at%207.27.29%20PM.png?alt=media&token=0e106944-dc9e-441f-b51d-84a490717d6f)


7. Click on `New Credentials` . Give the credentials a name for **Select Service Id** use `Auto Generate` . Click Add.

![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZ6KCjOTL8aajib5Ovt%2F-LZ7IuPsarOX4aeuRrvA%2FScreen%20Shot%202019-02-19%20at%207.29.25%20PM.png?alt=media&token=1a59286b-ca8b-44f8-ac01-5158b47bd364)


8. Once its generated click on **view credentials** to take a look at it. We will need the `username` and `password` at a later step.
9. Go Back to **Manage** on the left hand side. Click on `Launch Cloudant Dashboard` Once it loads. On the left hand side click on `Databases` and then click on `Create Database` on the top nav bar.

![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZ6KCjOTL8aajib5Ovt%2F-LZ7LPP6a0-yJPhq1c6Q%2FScreen%20Shot%202019-02-19%20at%207.40.28%20PM.png?alt=media&token=dcf4f443-30d1-417a-92ba-ead5429f0f62)


10. Name the database `questions` Just like the database I already have. The reason we are doing this is when we create a question we would put it in here. And I did not want to check for database existing every-time when the function ran. This will make more sense when we look at the function. For now just take my word for it. It's also a place to view your data. If you ever need to look closely at your data this is where you will do so.


## Step 8: Twilio
**!!!CAUTION**
> Twilio has a trial account where they give 15$ credit to try twilio out. With that account you do not need a credit card but the credit will deplete as you use the trial account. Check the pricing per message on twilio for more information.

- Sign Up for twilio. [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
- In the create a project window change tab to select product.
- Select Programmable SMS and go in the bottom to select next.
- Give the project a name and skip the rest of the step.
- If you select the second tab on the left, you will see something like this
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZLbO7kZq2O4O75hcFu%2F-LZNzL8HI2lygFddkzq8%2Fimage.png?alt=media&token=7971213f-8ed0-44fa-abe6-e1d8ce1cee91)

- By default the trial accounts in twilio can only send message to verified numbers. This means you could make your app and try it out yourself. But you won't be able to send other people messages. This is fine for our need. 
- Click on `Get Started`
- Click on `Get a Number`
- This will automatically assign a number for you. Choose the number or search for a different number if you want. Once you are happy `Choose this Number` to confirm.
- Click on SMS on the second left nav bar. You should see something like this.
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZLbO7kZq2O4O75hcFu%2F-LZO-c1giNIpKd24o63g%2Fimage.png?alt=media&token=f342b175-de26-43fd-a17f-de88b067c9c0)

- Click on `Create new Messaging Service` . Give it a name and for Use case select mixed.
- Check the `PROCESS INBOUND MESSAGES` box. The would show two more text boxes, one for `Request URL` and one for `Fallback URL` This is where we would use our handle-message function webhook to handle incoming twilio message.
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZLbO7kZq2O4O75hcFu%2F-LZO0b2lHTaYAw4CtIXM%2Fimage.png?alt=media&token=d5681d40-d393-4624-99c0-99b30319446c)


This is all we need for now. We will come back to it in a bit.


## Step 9: Functions

I am using a total of 5 functions to manage the backend of this application. 
There are no actual setup in this page. But you should read this to know what each of the functions do and why they are there.
They are:

- create-quesition
- get-question
- get-all-votes
- submit-vote
- handle-message
### Task of each function

**Create Question**
This function does exactly as the name suggests. It creates a new question. It does a little more that that. The things this function has to accomplish are following.

- Take user input for a `id` of the question, the `question` and the `options`.
- Connect to the cloudant database using the input username and password.
- Check if the id already exists.
- Create a new record in the `questions` table with the id, question and options.
- Create a new table for the votes for that question to be stored. 
- Create an index on that table so that it can be sorted with timestamp.

Thats a pretty overloaded function to be honest. But most of these are one time things that needs to happen for the rest of the app to function (no pun intended) properly. 

**Get Question**
This function is probably used in most places in the app. 

- Takes in the `id` , `username` , `password` from user.
- Connect to the cloudant database using the input `username` and `password`.
- Query the `questions` table for the `id`
- If `id` exists in the table already that means the id is taken and is an error condition.
- If no error it returns the `question` and `options` from the `questions` table.

**Get All Votes**
This function is mainly used for the initialization of graph.

- Get id of a question from input.
- Connect to the cloudant database.
- Connect to the table of the specific question.
- Get all the record from the table.
- Return all the question.

**Submit Vote**
This function will probably be the most used. This is what drives our application.

- Get id of a question from input.
- Get index of the option voting for.
- Connect to cloudant.
- Try to use the db for the quesiton.
- If that table can not be found then the id was not valid. Return error.

Because we create that table when the question was created. I think we could explicitly check to see if question exist and create that table if the question existed. But I think it's fine for our application.

- Create a record in the table.
- Publish the message to PubNub.

**Handle Message**
This function is used to deal with incoming message to twilio. The way this works is when a message is sent to our twilio number it invokes a web action and passed a bunch of data to related to the message to the function. That data will look something like this.
```
    "params": {
        "AccountSid": "XXXXXXXXXXXXXXXXX",
        "ApiVersion": "2010-04-01",
        "Body": "Hello",
        "From": "+12101234567",
        "FromCity": "NEW YORK",
        "FromCountry": "US",
        "FromState": "NY",
        "FromZip": "10010",
        "MessageSid": "XXXXXX",
        "MessagingServiceSid": "XXXXX",
        "NumMedia": "0",
        "NumSegments": "1",
        "SmsMessageSid": "XXXXX",
        "SmsSid": "XXXXX",
        "SmsStatus": "received",
        "To": "+12345678901",
        "ToCity": "NEW YORK CITY",
        "ToCountry": "US",
        "ToState": "NY",
        "ToZip": "",
        "__ow_headers": {
            "accept": "*/*",
            "accept-encoding": "gzip",
            "cache-control": "max-age=259200",
            "cdn-loop": "cloudflare",
            "cf-connecting-ip": "3.80.37.106",
            "cf-ipcountry": "US",
            "cf-ray": "4acaab98fc9f9fe4-IAD",
            "cf-visitor": "{\"scheme\":\"https\"}",
            "content-type": "application/x-www-form-urlencoded",
            "host": "us-south.functions.cloud.ibm.com",
            "user-agent": "TwilioProxy/1.1",
            "x-forwarded-for": "3.80.37.106, 172.68.65.194",
            "x-forwarded-host": "us-south.functions.cloud.ibm.com",
            "x-forwarded-port": "443",
            "x-forwarded-proto": "https",
            "x-global-k8fdic-transaction-id": "XXXXXX",
            "x-real-ip": "172.68.65.194",
            "x-request-id": "XXXXXX",
            "x-twilio-signature": "3bE9I/FWo8q2JgGY46pnmsQclxU="
        },
        "__ow_method": "post",
        "__ow_path": ""
    }
```
Here `To` is the twilio number and `From` is where the message is being sent from.
We will setup twilio stuff in the next step.
This is what the handle-message function does.

- Get user sent text from the `body` key of the params sent to the function. The above example has body *hello* 
- For the logic of dealing with the body text, we took a pretty simple approach. If the text is a `?` or has `help` in it, we will send information on how to use the app using message. If the message has one line we will try to get the question and set a variable with the question and option. If the message body has 2 lines we will use the first line as id and second line as the choice of vote.
- If it fails at any reason we will set the variable with the appropriate message.
- Return a `Twiml` message with out message variable that twilio will interpret and send a message to out user.


## Step 10: React
- In Setup you already should have the git repo cloned. Go into the `realtime-polling` folder that was cloned.
    cd realtime-polling
- Copy the `secret.template.json` file to `secret.json`
    ```
    cp src/secret.template.json src/secret.json
    ```
- This is what the `secret.json` file should contain
```   
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
- We will complete this file later. But we need this to start the application.
- Install the application dependencies
    npm install
- Start the application server
    npm start
- You should see the application pop up in the browser at [http://localhost:3000](http://localhost:3000/)



## Step 11: Create the Functions

In this section we will create our function. We will see how to create function using both the web ui and cli.

### From the Web UI
- Log into [IBM Cloud](https://cloud.ibm.com/)
- Click the top left hamburger.
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZQiXj8cESIbJv-Gx03%2F-LZQkKT9SMoaetb41w-z%2FScreen%20Shot%202019-02-23%20at%202.06.06%20PM.png?alt=media&token=9c5f9f2c-167e-4733-8c33-f10dfbe2e92d)

- Select functions
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZQiXj8cESIbJv-Gx03%2F-LZQkZ1nfdHfn-mAp-J5%2FScreen%20Shot%202019-02-23%20at%202.06.58%20PM.png?alt=media&token=f3daf9b0-eea9-4f8b-8397-ae981caf5aad)

- Go to actions
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZQljGdJKw6gREQt-7y%2F-LZQlyj0yqQ38wmxYwid%2FScreen%20Shot%202019-02-23%20at%202.08.47%20PM.png?alt=media&token=5e779623-5fee-43e8-aa4f-0c6c3295ec85)

- Click on Create 
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZQljGdJKw6gREQt-7y%2F-LZQmJtkovZBmjL4AM5W%2FScreen%20Shot%202019-02-23%20at%202.14.50%20PM.png?alt=media&token=56d22a04-f2c2-4ce2-a1bb-a84c3f3ddba0)

- Click on Create Actions
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZQljGdJKw6gREQt-7y%2F-LZQmRN0lZpDOCJ5Ykbn%2FScreen%20Shot%202019-02-23%20at%202.16.25%20PM.png?alt=media&token=a4309108-e569-4e9a-896a-2d9c5fe5597e)

- Give the action a name. For out first action we will create `create question` action. We will also put this action in a package called `workshop`. Package helps us organize our functions. For runtime select Node.js 10
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZQljGdJKw6gREQt-7y%2F-LZQmvXfo58H7rf5alG6%2Fimage.png?alt=media&token=71885aae-f1f9-4194-a68e-1c53016b1c3c)


First time you would have to create package to get the package. For any other time, you can find the workshop package in the dropdown

- Click on Create
- This would take us to the editor. 
    /**
      *
      * main() will be run when you invoke this action
      *
      * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
      *
      * @return The output of this action, which must be a JSON object.
      *
      */
    function main(params) {
            return { message: 'Hello World' };
    }
- We can invoke this action by clicking the Invoke button. 
- We can also change input to pass in a params.
- We can set default parameters from `Parameters` tab on the left.
- From the cloned folder, go to the functions directory.
    cd functions
- All five functions are in their own. Copy the `create-questio.js` file from the create-question folder.
- Paste it in the web editor.
 ```
     /**
     *
     * main() will be run when you invoke this action
     *
     * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
     *
     * @return The output of this action, which must be a JSON object.
     *
     */
    const Cloudant = require('@cloudant/cloudant');
    let cloudant = null;
    async function main(params) {
      if (params.id === undefined || params.question === undefined || params.options === undefined) {
          return {
            error: "Not Enough Arguments",
          }
      }
      const reused = cloudant != null;
      var username = params.username;
      var password = params.password;
      if (cloudant == null) {
        cloudant = Cloudant({
          account: username,
          password: password
        });
      }
      var id = params.id;
      const database = cloudant.db.use('questions');
      const docs = (await database.find({
        "selector": {
          "_id": id
        },
        "fields": [
          "_id",
          "question",
          "options"
        ]
      })).docs;
      if (docs.length > 0) {
        return {
          error: "ID already Exists",
        }
      };
      const data = {
        _id: id,
        question: params.question,
        options: params.options,
      }
      const result = await database.insert(data);
      console.log(result.ok);
      if (result.ok) {
        dbcreate = await cloudant.db.create("questions-" + id);
        return {
          ok: true,
          payload: id,
        }
      }
      return {
        error: "Insertion failed",
      };
    }
    exports.main = main;
```
- From the code we can see we are expecting params object to have 5 things. `id`, `question`, `options`, `username` and `password`. First 3 will be passed in when the function is being called via api. Username and Password we will set now using default parameter. 
- Go to `parametes` from the left nav bar.
- We will need the user name and password created in the `Cloudant Database` step. 
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZQrySXgW6DQNc0qtUU%2F-LZQw61oPvKRE60-C3qu%2FScreen%20Shot%202019-02-23%20at%202.57.40%20PM.png?alt=media&token=0984a4ba-7a47-4f1e-b7ad-92e380b54a85)

- Go back to the code tab.
- Click on change input.
- Paste the following JSON and Apply.
```
{
        "id": "001",
        "question": "Who was the best James Bond",
        "options": ["Daniel Craig", "Sean Connery", "Pierce Brosnan", "Roger Moore"]
    
}
```
- Invoke it once and you should  see something like this on the side.
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZQrySXgW6DQNc0qtUU%2F-LZQxtjSSDzKQA8qDknl%2Fimage.png?alt=media&token=626d85be-eb12-4caf-ab33-527a2a9835c7)

- Invoke again however, you should see error. Because that was the logic we implemented.
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZQxy34llq_osGfF0T9%2F-LZQy44335-8lHgfZGBu%2Fimage.png?alt=media&token=232513d9-5fbf-40b1-8306-c79462a99cba)

- We will enable the api gateway in a second.
### From the CLI

Let's create an action from the CLI. We will create the get-question action.

- Login to IBM Cloud CLI
    ```
    ibmcloud login
    ```
- Use your user name and password to login.

you can also do `ibmcloud login --sso` to login using the single sign on method using your browser and access token.

- Target a cloud foundry org.
    ```
    ibmcloud target --cf
    ```
- Check you have the cloud functions plugin enabled.
- Run `ibmcloud fn` and it should show the help page for IBM Cloud plug-in.
- To see the actions in our account run
    ibmcloud fn action list

Output:

    actions
    /thisismofi@gmail.com_dev/workshop/create-question                     private nodejs:10
- We should see the other action we had created in the previous step.
- To create the action lets change directory into the folder containing the `get-question.js` file. If you in the realtime-polling folder, it is under `function/get-question` . 
    ```
    cd functions/get-quesiton
    ```
- Create the action
    ibmcloud fn action create workshop/get-question get-question.js --kind nodejs:10
- We should be able to see the action with `ibmcloud fn action list` 
- We will setup the default parameter next.
    ```
    ibmcloud fn action update workshop/get-question --param username "YOUR-CLOUDANT-USERNAME-HERE" --param password "YOUR-CLOUDANT-PASSWORD-HERE"
    ```
- We can now invoke the action from the CLI as well
    ibmcloud fn action invoke workshop/get-question --param id 001

Output:
```
    {
        "ok": true,
        "payload": [
            {
                "_id": "001",
                "options": [
                    "Daniel Craig",
                    "Sean Connery",
                    "Pierce Brosnan",
                    "Roger Moore"
                ],
                "question": "Who was the best James Bond"
            }
        ]
    }
```
- This is returning what we inserted in the previous step.
### Action with External Dependency

The `submit-vote`  action has external dependency. Actions with external dependencies can not be created using the web cli. We will use the terminal for this.

- Change directory in the submit-vote folder. Install the dependencies.
    ```
    npm install
    ```
- Package the files into a zip. 
    ```
    zip -r submit-vote.zip *
    ```
- The `zip` command will only work in a MacOS or linux environment. For windows users use a third party tool like 7zip or look at this [stack-overflow answer](https://stackoverflow.com/a/18180154/10272405) 
- Create the action as you would. 
    ibmcloud fn action create workshop/submit-vote submit-vote.zip --kind nodejs:10
- This action needs 5 default parameters. The Cloudant `username` & `password` as well as the `publish_key`, `subscribe_key` and `secret_key` key from pubnub. Look back at the pubnub section in setup to find these.
- You can setup the default parameters from either the CLI or the Web UI.

**CLI**
MacOS/Linux
Windows CMD
Windows Powershell
```
    ibmcloud fn action update workshop/submit-vote `
    --param publish_key "YOUR PUBNUB PUBLISH KEY" ` 
    --param subscribe_key "YOUR PUBNUB SUBSCRIBE KEY" ` 
    --param secret_key "YOUR PUBNUB SECRET KEY" ` 
    --param username "CLOUDANT USERNAME" ` 
    --param password "CLOUDANT PASSWORD"
```

**Web UI**

- Go to Functions. Click on the submit-vote action from the list of actions. Go to parameters. Add the parameters.
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZRImNo9ekYBhv_twFO%2F-LZRK-g2hsztb9PBjnrU%2FScreen%20Shot%202019-02-23%20at%204.46.41%20PM.png?alt=media&token=a6dce4c5-17e0-4e40-9eb6-3f8145c4467c)

### Finish The Rest

This leaves two function. `get-all-votes` and `handle-message`. This do not have any external dependencies. So feel free to create it from the cli or the web ui.
The get-all-votes function needs two default parameter. Cloudant `username` and  `password`. We already went over how we can add those.

### Note About External Dependency

If you look at the code we have a few functions with dependencies on `Cloudant` and one with `Openwhisk` . These were not considered external dependencies in IBM Cloud Functions. There are a bunch of packages that come preinstalled in the environment. 
[See this page for a complete list](https://cloud.ibm.com/docs/openwhisk?topic=cloud-functions-openwhisk_reference#openwhisk_ref_javascript_environments_10)
Some of the packages are-

- [async v2.6.1](https://www.npmjs.com/package/async) - Provides functions for working with asynchronous functions.
- [mongodb v3.1.12](https://www.npmjs.com/package/mongodb) - The official MongoDB driver for Node.js.
- [mysql v2.16.0](https://www.npmjs.com/package/mysql) - This is a node.js driver for mysql.
- [openwhisk v3.18.0](https://www.npmjs.com/package/openwhisk) - JavaScript client library for the OpenWhisk platform. Provides a wrapper around the OpenWhisk APIs.
- [@cloudant/cloudant v3.0.2](https://www.npmjs.com/package/@cloudant/cloudant) - This is the official Cloudant library for Node.js.
- [redis v2.8.0](https://www.npmjs.com/package/redis) - This is a complete and feature rich Redis client for Node.js.
- [request v2.88.0](https://www.npmjs.com/package/request) - Request is designed to be the simplest way possible to make HTTP calls.
- [twilio v3.27.1](https://www.npmjs.com/package/twilio) - A wrapper for the Twilio API, related to voice, video, and messaging.



## Step 12: API Gateway

We have our functions, but how do we use it in our app? API gateway is great way to manage access to our function. 
**Get Question API**

- From IBM Cloud dashboard page, go to functions. 

If you are having trouble you can see how to get to functions in the previous step. 

- On the left nav bar the very last tab APIs. Click APIs
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZRVRTE-IKbvxE5Vgag%2F-LZRWu_6FusRi1QdZGxg%2FScreen%20Shot%202019-02-23%20at%205.43.03%20PM.png?alt=media&token=8d3b7463-1c19-44c2-bba8-67804e8feab8)

- Click on Create a Cloud Functions API
- Give the API a name. First we will create the `get-question` api. Set a base path for the API. Then Click on Create operation.
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZRVRTE-IKbvxE5Vgag%2F-LZRY4YLYoWvFbVvPen7%2FScreen%20Shot%202019-02-23%20at%205.48.40%20PM.png?alt=media&token=2abb7ea5-a6b4-40ae-831f-33edce53317f)

- In the Create Operation dialog for path just put `/` since we will only have one api at that end point. For verb select get and select the action `get-quesiton` from package `workshop` Response content type is `application/json` 
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZRVRTE-IKbvxE5Vgag%2F-LZR_DFEE_3WOMDrDqp0%2FScreen%20Shot%202019-02-23%20at%205.49.36%20PM.png?alt=media&token=b1142a4e-578c-4bd2-999f-fdf8f24a01c9)

- Under Security and Rate limiting, Enable application authentication. Set the Method as API Key only.
- Enable rate limiting. For maximum calls select a reasonable number for our application I will assume 20 calls should be ok.
- We will skip OAuth for now, but you can add social login with IBM Cloud App ID, Google, Facebook or Github.
- Finally we will leave CORS enabled. This will allow our react app to call this api.
- From the get-quesiton api page, Click on Sharing on the left nav bar.
- Click on Create API Key on Sharing Outside of Cloud Foundry Organizations section.
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZRcIZ7W-J1tS34BTnS%2F-LZRcbHuOo9m89fDfvMs%2FScreen%20Shot%202019-02-23%20at%206.12.59%20PM.png?alt=media&token=3907663a-4e56-47d3-bc1e-96469c37dd3f)

- You should give it a name. I will name mine `get-question-api-key` . Click Create.
- Once the api key is created you should see a API Portal Link.
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZRcIZ7W-J1tS34BTnS%2F-LZRdL6Tzjl5lfs-pMYQ%2FScreen%20Shot%202019-02-23%20at%206.16.06%20PM.png?alt=media&token=d6fddfaa-eaa7-4e6c-86df-fe9d9d32abb4)

- If you click the API Portal link it will show you the API and how to access it via curl and 7 programming languages including Java, Node, Go, Python. 
- Go to API explorer to find the Endpoint for the API.
- Make a note of the `API Key` and the `API Endpoint` . We will need these for our react application.

**Get All Votes API**
Follow above instruction for  create API for get-all-votes function.

**Submit Vote API**
You can follow almost all the steps for submit-vote function as well. Just for HTTP verb use POST.
If you are wondering why not get here as well. [Read This](https://stackoverflow.com/a/46614/10272405).


## Step 13: Putting It All Together
- In the src folder of the application, there is a file called `secret.template.json` , copy the file and save it as `secret.json` . 
- The content of the `secret.json` file is as follows
```
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
- Replace the data with data collected on the previous steps.
- If you are having trouble finding the PubNub keys take a look at the pubnub section of the Setup
- The URL and API keys we got in the previous step
- If everything else worked, we should be able to now be able to search for our question that we created.
- Type in the ID and press enter.
- For the question we created the ID was "001"
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZS_uBUAQ6srol8ApO_%2F-LZSaj22eMktcIjCHBwE%2Fimage.png?alt=media&token=c88b92b9-d2c3-41a8-878d-a45cf2bd963c)

- Open a new browser window, go to the question again then go to `Watch The Votes` , you will see a bar graph of the question and the options. Vote on one of the screen, you can see the numbers rise on the other screen. 
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZS_uBUAQ6srol8ApO_%2F-LZSp1QpEwh0uBojJqqD%2Fimage.png?alt=media&token=bc748317-2651-4bf5-8b46-5f844e285392)

- And with that the application is done. 

But wait I did promise you we will do that with twilio too. 
Lets do that in the next section.


## Step 14: Twilio Webhook

For handling twilio messages we will convert the handle message function into a web action.

- Go to [https://cloud.ibm.com/openwhisk/actions](https://cloud.ibm.com/openwhisk/actions) 
- Select handle-message action
- Click on Endpoints
- Check Enable as Web Action
- Then Click Save
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZS0eVE8wsCIbPeOC7V%2F-LZS4Zd4xe1OLrx44PAG%2FScreen%20Shot%202019-02-23%20at%208.18.12%20PM.png?alt=media&token=fe39c508-b4dc-4000-97ad-66956b7b1493)

- Copy the URL then Go to twilio dashboard -> Programmable SMS -> SMS -> Polling (or your application name) -> Configure -> Enable Process Inbound Messages
- Paste the URL as the Request URL, but change the end to `.http` from `.json` this tells twilio to accept a HTTP response and not a JSON response. This is crucial because we are making use of `TwiML` to send reply to our user.
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZS0eVE8wsCIbPeOC7V%2F-LZS6twmZPmSXnPapdxK%2FScreen%20Shot%202019-02-23%20at%208.29.14%20PM.png?alt=media&token=edd767f0-b5d6-49fc-bb7b-cca2b802834a)

- Lets go test our offline capabilities shall we?
- From your phone text the twilio number.
- If you text a `?` it should reply back with some helpful text.
- If you text a `id` of a question. It will reply with the question and options.
- If you text a `id` and a `index` separated by a new line vote will be submitted for that id  for that index.
![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LZ65VMcC6GKwiN_hLYh%2F-LZSrp-y5rbJDnsoQTz8%2F-LZSrryuqXq72uBMiADg%2FScreen%20Shot%202019-02-23%20at%2011.59.12%20PM.png?alt=media&token=8c81facd-99e2-4e65-a684-1943815e1741)




# Summary

This is a very simple use case. But being serverless can be a great way to build backend for mobile apps as well as web apps. And with the power of twilio you can easily enable offline capabilities to your app.
Hopefully now you know how to 

- Create openwhisk functions
- Enable functions as web apis
- Create functions with dependency
- Connect to cloudant database from openwhisk
- Receive text message and respond to it using webhooks


# Related links
- [Learn About Openwhisk](https://openwhisk.apache.org/)
- [Learn More About IBM Cloud Functions](https://cloud.ibm.com/docs/openwhisk?topic=cloud-functions-getting_started#getting-started-with-openwhisk)
- [Articles By James Thomas](http://jamesthom.as/blog/categories/openwhisk/)

