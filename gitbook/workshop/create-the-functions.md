# Create the Functions

In this section we will create our function. We will see how to create function using both the web ui and cli.

## From the Web UI

* Log into[ IBM Cloud](https://cloud.ibm.com)
* Click the top left hamburger.

![](../.gitbook/assets/screen-shot-2019-02-23-at-2.06.06-pm.png)

* Select functions

![](../.gitbook/assets/screen-shot-2019-02-23-at-2.06.58-pm.png)

* Go to actions

![](../.gitbook/assets/screen-shot-2019-02-23-at-2.08.47-pm.png)

* Click on Create 

![](../.gitbook/assets/screen-shot-2019-02-23-at-2.14.50-pm.png)

* Click on Create Actions

![](../.gitbook/assets/screen-shot-2019-02-23-at-2.16.25-pm.png)

* Give the action a name. For out first action we will create `create question` action. We will also put this action in a package called. Package helps us organize our functions. For runtime select Node.js 10

![](../.gitbook/assets/image%20%282%29.png)

{% hint style="info" %}
First time you would have to create package to get the package. For any other time, you can find the workshop package in the dropdown
{% endhint %}

* Click on Create
* This would take us to the editor. 

```javascript
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

```

* We can invoke this action by clicking the Invoke button. 
* We can also change input to pass in a params.
* We can set default parameters from `Parameters` tab on the left.
* From the cloned folder, go to the functions directory.

```bash
cd functions
```

* All five functions are in their own. Copy the `create-questio.js` file from the create-question folder.
* Paste it in the web editor.

```javascript
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

* From the code we can see we are expecting params object to have 5 things. `id`, `question`, `options`, `username` and `password`. First 3 will be passed in when the function is being called via api. Username and Password we will set now using default parameter. 
* Go to `parametes` from the left nav bar.
* We will need the user name and password created in the `Cloudant Database` step. 

![](../.gitbook/assets/screen-shot-2019-02-23-at-2.57.40-pm.png)

* Go back to the code tab.
* Click on change input.
* Paste the following JSON and Apply.

```text
{
    "id": "007",
    "question": "Who was the best James Bond",
    "options": ["Daniel Craig", "Sean Connery", "Pierce Brosnan", "Roger Moore"]
}
```

* Invoke it once and you should  see something like this on the side.

![](../.gitbook/assets/image%20%283%29.png)

