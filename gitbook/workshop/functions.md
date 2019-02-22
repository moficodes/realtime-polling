# Functions

I am using a total of 5 functions to manage the backend of this application. 

They are:

* create-quesition
* get-question
* get-all-votes
* submit-vote
* handle-message

## Task of each function

### Create Question

This function does exactly as the name suggests. It creates a new question. It does a little more that that. The things this function has to accomplish are following.

* Take user input for a `id` of the question, the `question` and the `options`.
* Connect to the cloudant database using the input username and password.
* Check if the id already exists.
* Create a new record in the `questions` table with the id, question and options.
* Create a new table for the votes for that question to be stored. 
* Create an index on that table so that it can be sorted with timestamp.

Thats a pretty overloaded function to be honest. But most of these are one time things that needs to happen for the rest of the app to function \(no pun intended\) properly. 

### Get Question

This function is probably used in most places in the app. 

* Takes in the `id` , `username` , `password` from user.
* Connect to the cloudant database using the input `username` and `password`.
* Query the `questions` table for the `id`
* If `id` exists in the table already that means the id is taken and is an error condition.
* If no error it returns the `question` and `options` from the `questions` table.

### Get All Votes

This function is mainly used for the initialization of graph.

* Get id of a question from input.
* Connect to the cloudant database.
* Connect to the table of the specific question.
* Get all the record from the table.
* Return all the question.

### Submit Vote

This function will probably be the most used. This is what drives our application.

* Get id of a question from input.
* Get index of the option voting for.
* Connect to cloudant.
* Try to use the db for the quesiton.
* If that table can not be found then the id was not valid. Return error.

{% hint style="info" %}
Because we create that table when the question was created. I think we could explicitly check to see if question exist and create that table if the question existed. But I think it's fine for our application.
{% endhint %}

* Create a record in the table.
* Publish the message to PubNub.



