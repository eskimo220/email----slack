const express = require("express");
const helmet = require("helmet");
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(helmet());

app.get("/", (req, res) =>
  res.redirect("https://github.com/eskimo220/email----slack")
);

const decodeChannel = function(email) {
  const decode = process.env.DECODE && process.env.DECODE.split(",");
  if (!decode) return false;
  if (!decode[0]) return false;

  const toAndCc = [...email.to, ...email.cc];
  for (let i = 0; decode[i]; i += 2) {
    const address = decode[i];
    if (toAndCc.some((o) => o.address === address)) {
      return decode[i + 1];
    }
  }
};

app.post("/", (req, res) => {
  console.log(`Email is comming.`);

  const body = req.body;
  console.log(body);
  console.log(req.headers);

  if (body["challenge"]) {
    // is a challenge
    res.json(({ challenge } = body));
  }

  // validate
  const err = [
    // 1.
    body.event.type !== "message" &&
      `Event type is ${body.event.type}, must be "message".`,
    // 2.
    body.api_app_id !== process.env.APP_ID && "APP_ID is wrong.",
    // 3.
    body.token !== process.env.VERIFICATION_TOKEN &&
      "VERIFICATION_TOKEN is wrong.",
    // 4.
    body.team_id !== process.env.TEAM_ID && "TEAM_ID is wrong.",
    // 5.
    body.event.channel !== process.env.USLACKBOT_CHANNEL &&
      "USLACKBOT_CHANNEL is wrong.",
    // 6.
    body.event.user !== "USLACKBOT" && "USLACKBOT is wrong.",
    // 7.
    body.event.subtype !== "file_share" && "subtype is wrong.",
  ];

  const hasErr = err.find((o) => !!o);
  if (hasErr) {
    console.error(new Error(hasErr));
    return res.sendStatus(200);
  }

  if (req.headers["x-slack-retry-num"]) {
    // This email has already been processed
    console.log("x-slack-retry-num, skip it.");
    return res.sendStatus(200);
  }

  const email = body["event"]["files"][0];

  // log email
  console.debug(email);

  const toSend = {
    channel: decodeChannel(email),
    text: `<${email.permalink}|You have received an email.>`,
    as_user: true,
    unfurl_links: true,
  };

  if (!toSend.channel) {
    return res.sendStatus(200);
  }

  if (email.attachments[0]) {
    toSend.text += "Please attention there is attachment file.";
  }

  axios
    .post("https://slack.com/api/chat.postMessage", toSend, {
      headers: {
        "content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${process.env.USER_TOKEN}`,
      },
    })
    .then((res) => {
      if (res.status !== 200) {
        console.log(`statusCode: ${res.status}`);
        console.error(new Error(res.data));
      }
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });

  
});

module.exports = app
