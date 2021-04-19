const express = require("express");
const helmet = require("helmet");
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(helmet());

app.get("/", (req, res) => res.json({ message: "todo" }));

app.post("/email----slack", (req, res) => {
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
    console.error(hasErr);
    return res.sendStatus(401);
  }

  if (req.headers["X-Slack-Retry-Num"]) {
    // This email has already been processed
    console.log("X-Slack-Retry-Num");
    return res.sendStatus(401);
  }

  const email = body["event"]["files"][0];

  const toSend = {
    token: process.env.USER_TOKEN,
    channel: process.env.SEND_TO_CHANNEL,
    text: `<${email.permalink}|has receive a email.>`,
    as_user: true,
    unfurl_links: true,
  };

  if (email.attachments) {
    toSend.text += "Please attention there is attachment file.";
  }

  axios
    .post("https://slack.com/api/chat.postMessage", toSend)
    .then((res) => {
      console.log(`statusCode: ${res.statusCode}`);
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });

  res.sendStatus(200);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
