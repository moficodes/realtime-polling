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
const PubNub = require('pubnub');

let cloudant = null;
let pubnub = null;

async function main(params) {
  if (params.id === undefined || params.index === undefined) {
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

  const id = params.id;
  const dbname = "questions-" + id;

  var results = await cloudant.db.list();
  if (!results.includes(dbname)) {
    return {
      error: "Not a valid ID"
    }
  }

  const database = cloudant.db.use(dbname);

  const record = {
    index: params.index,
    timestamp: new Date().getTime()
  }

  const result = await database.insert(record);
  if (!result.ok) {
    return {
      error: "Insertion failed"
    }
  }

  if(pubnub == null){
    pubnub = new PubNub({
      publishKey: params.publish_key,
      subscribeKey: params.subscribe_key,
      secretKey: params.secret_key,
      ssl: true,
    })
  }

  var publish = await pubnub.publish({
    message: record,
    channel: "channel-"+id,
    sendByPost: false,
    storeInHistory: false
  });

  console.log(publish)

  return {
    "success": true,
  }
}

exports.main = main;
