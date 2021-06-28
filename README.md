# Send Email to any Slack channels or DMs and stay free plan. (attachments is OK)

Let the slack [free feature](https://slack.com/help/articles/360056298994-Send-emails-to-your-direct-message-with-Slackbot) work for us like [paid feature](https://slack.com/help/articles/206819278-Send-emails-to-Slack). There is a hack for you.

I was inspired by this [project](https://github.com/kossiitkgp/email-to-slack). Thanks to the author.
https://github.com/kossiitkgp/email-to-slack

## Preview

![image](https://user-images.githubusercontent.com/12117930/115841883-d3ef9e80-a44f-11eb-882b-629803409e44.png)

## Key Features

- stay slack free plan.
- one click to deploy. (use Heroku Button)
- attachments is OK.

## How To Use

### 1. Slack mail generation

1. Generate the email for forwarding to slack from "**Preferences -> Messages and Media -> Bring emails into Slack**"
   ex email: `[something]@[workspace].slack.com`

   this is the [free slack feature](https://slack.com/help/articles/360056298994-Send-emails-to-your-direct-message-with-Slackbot).

2. Setup forwarding in gmail.
   Gmail sends a email to slack with the link to confirm. This email shows up in the slackbot. Click on the link and accept forwarding.
3. Send a sample mail to account to test whether it gets forwarded correctly. This email should show up in the slackbot dm.

### 2. Creating the Slack App

1. Go to api.slack.com/apps and create a new Slack app.
2. Save the following details:
   **App ID** and
   **Verification token**
3. In "**Sidebar -> OAuth and Permissions**" give the permissions for:
   - `chat:write`, `im:history` in User Token Scopes
4. Then Install the app from "**Sidebar -> OAuth and Permissions**"
5. get 7 vars. These will be used in the next step.

| Config Variable      | Description                                                      |
| -------------------- | ---------------------------------------------------------------- |
| `APP_ID`             | You get this when you create the app                             |
| `VERIFICATION_TOKEN` | You get this when you create the app                             |
| `TEAM_ID`            | ID of your slack workspace.                                      |
| `USLACKBOT_CHANNEL`  | The ID of the direct messaging channel between you and @slackbot |
| `VERIFICATION_TOKEN` | You get this when you create the app                             |
| `SEND_TO_CHANNEK`    | The ID of the channel that u want to send                        |
| `USER_TOKEN`         | User OAuth Toekn, on **OAuth& Permissions** page                 |

### 3. Deploying to Heroku

Use button can deploy to heroku quickly. please input all 7 config vars.

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

### 4. Setup of Event Subscription

1. Navigate to "**Sidebar -> Event Subscription**" and turn on.
2. Put the link to the deployed server in "Request URL".
3. Subscribe to `message.im` in **Subscribe to events on behalf of users**

Viola the setup is complete!

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
$ git clone https://github.com/eskimo220/email----slack.git # or clone your own fork
$ cd email----slack
$ npm install
$ npm run dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

## New Features

Sometimes We want to send the email to multiple channels under certain conditions, Use the DECODE vars.

FROM_OR_TO_EMAIL_ADDRESS1,CHANEL_ID1,FROM_OR_TO_EMAIL_ADDRESS2,CHANEL_ID2
