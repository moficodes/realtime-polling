# Application Overview

## Real Time Polling

This project is a demo application made with react as front end and openwhisk serverless functions and cloudant database as a backend.

### Technlogy Used

* [ReactJS](https://reactjs.org/)
* [Openwhisk](https://openwhisk.apache.org/)
* [Cloudand Database](https://www.ibm.com/cloud/cloudant)
* [IBM Cloud Functions](https://console.bluemix.net/openwhisk/)
* [NodeJS](https://nodejs.org/en/)
* [Twilio](https://www.twilio.com/)
* [PubNub](https://www.pubnub.com/)

### Prereq

To be able to follow along or complete this tutorial/workshop you need the following.

#### Openwhisk

* I would be using IBM Cloud Functions that uses Openwhisk.
  * [Sign up for IBM Cloud](https://ibm.biz/BdYan6) 

**Or**

* [Openwhisk Local Installation](https://openwhisk.apache.org/documentation.html#openwhisk_deployment) for testing
  * For setting up openwhisk local you need
    * [docker](https://docs.docker.com/docker-for-mac/)
    * [docker-compose](https://docs.docker.com/docker-for-mac/)

#### Prorgramming Language

For this demo I am using **Node**. But with openwhisk you can write your functions in Node, Swift, Go, Python, Java, Ruby, Php and in the unlikely case none of the above is your language, you can create a docker image of your function and openwhisk will run that. So its safe to say openwhisk can run it all.

#### Cloudant Database

Lite version of CLoudant available from IBM Cloud.

#### React

For front end I am using React. This will be a very simple use of react. We wont go much deep into the use of reactjs in this workshop.

**Twilio**

Twilio is a messaging platform that we will make use of to collect votes. There are many other things twilio can do. Visit their website to find out more.

**PubNub**

The real time portion of the app depends on PubNub. PubNub gives us a publish and subscribe platform where we can get real time data streaming in our app.

### App Flow

![](.gitbook/assets/flow%20%281%29.png)

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





