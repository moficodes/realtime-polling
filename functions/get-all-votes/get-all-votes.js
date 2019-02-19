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
  if (params.id === undefined) {
    return {
      error: "Not Enough Arguments"
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

  const database = cloudant.db.use('questions-' + id);

  const docs = (await database.find({
    "selector": {
      "_id": {
        "$gt": "0"
      }
    },
    "fields": [
      "index"
    ],
    "sort": [{
      "timestamp": "asc"
    }]
  })).docs;

  if (docs.length > 0) {
    return {
      ok: true,
      payload: docs,
    }
  } else {
    return {
      error: "Question Not Found"
    }
  }
}

exports.main = main;