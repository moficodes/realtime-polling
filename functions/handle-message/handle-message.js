/**
 *
 * main() will be run when you invoke this action
 *
 * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
 *
 * @return The output of this action, which must be a JSON object.
 *
 */
const openwhisk = require('openwhisk');

async function main(params) {
  var ow = openwhisk()
  var body = "Send ID of the question to get the quesiton\nSend ID and choice separated by new line to submit vote";
  var text = params.Body.toLowerCase();
  console.log(text);
  if (text.indexOf("?") < 0 && text.indexOf("help") < 0) {
    var lines = text.split("\n")
    if (lines.length === 1) {
      var id = String(lines[0]);
      const param = {
        id: id,
      };
      var response = await ow.actions.invoke({
        name: 'workshop/get-question',
        blocking: true,
        result: true,
        params: param
      });
      if (response.ok) {
        var data = "";
        for (var i = 0; i < response.payload[0].options.length; i++) {
          data += `\n${i + 1}. ${response.payload[0].options[i]}`
        }
        body = `${response.payload[0].question}${data}`;

      } else {
        body = "Question not found\nCheck the ID again"
      }
    } else if (lines.length === 2) {
      var id = lines[0];
      var index = parseInt(lines[1]);
      if (isNaN(index)) {
        body = "Not a valid choice of index. Should be a number."
      } else {
        const param = {
          id: id,
          index: index - 1,
        }
        var response = await ow.actions.invoke({
          name: 'workshop/submit-vote',
          blocking: true,
          result: true,
          params: param
        });
        console.log(response);

        if (response.success) {
          body = `Vote submitted for ID: ${id}\nYou chose option: ${index}`
        } else {
          body = `Vote could not be submitted for ID: ${id}. Check ID again`;
        }
      }
    }
  }


  console.log(body);

  return {
    headers: {
      'Content-Type': 'text/xml'
    },
    body: '<Response><Message>' + body + '</Message></Response>'
  };
}