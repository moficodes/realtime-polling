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

* Take user input for a ID of the question, the question and the options.
* Connect to the cloudant database using the input username and password.
* Check if the id already exists.
* Create a new record in the `questions` table with the id, question and options.
* Create a new table for the votes for that question to be stored. 
* Create an index on that table so that it can be sorted with timestamp.

Thats a pretty overloaded function to be honest. But most of these are one time things that needs to happen for the rest of the app to function \(no pun intended\) properly. 

### Get Question

This function is probably used in most places in the app. This returns the question and options from the `questions` table if they exist.

