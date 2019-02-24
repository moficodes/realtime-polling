var fetch = require('node-fetch')

async function main(params) {
  var body = "Send ID of the question to get the quesiton\nSend ID and choice separated by new line to submit vote";
  var text = params.Body.toLowerCase();
  if (text.indexOf("?")<0 && text.indexOf("help")<0){
    var lines = text.split("\n")
    if (lines.length === 1) {
      var id = lines[0];
      var response = await getQuestion(id, params.GQURL, params.GQSecret);
      if (response.ok) {
        var data = "";
        for (var i = 0; i < response.payload.options.length; i++) {
          data += `\n${i + 1}. ${response.payload.options[i]}`
        }
        body = `${response.payload.question}${data}`;
      } else {
        body = "Question not found\nCheck the ID again"
      }
    } else if (lines.length === 2) {
      var id = lines[0];
      var index = parseInt(lines[1]);
      if (isNaN(index)) {
        body = "Not a valid choice of index. Should be a number."
      } else {
        var response = await submitAnswer(id, index, params.SQURL, params.SQSecret);
        if (response.ok) {
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

async function submitAnswer(id, index, url, secret) {
  var result = await fetch(url, {
    body: `{"id":${id},"index": ${index-1}}`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Ibm-Client-Id": secret
    },
    method: "POST"
  });
  const json = await result.json();
  console.log(json);
  if (!json.success) {
    return {
      error: "Json Error"
    };
  }
  return {
    ok: true
  }
}

async function getQuestion(id, endpoint, secret) {
  let url = endpoint + id;
  let response = await fetch(url, {
    headers: {
      'X-Ibm-Client-Id': secret,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  });
  let data = await response.json();
  if (!data.ok) {
    return {
      error: "No data found"
    };
  }
  return {
    ok: true,
    payload: data.payload[0]
  }
}

exports.main = main;