# micro-slack-auth
A microservice for OAuth with Slack. Shout out to [Max's repo](https://github.com/mxstbr/micro-github) for the inspiration.

## Getting Started

In order to run `micro-slack-auth`, you need to make sure you have your environment variables setup correctly. Make a copy of `.env.example`, name it `.env`, and update it with your Slack variables.

Here's an example:
```
# Your Slack application client ID
SLACK_CLIENT_ID=1234
# Your Slack application client secret
SLACK_CLIENT_SECRET=1234
# The URL to redirect a user to after they successfully connected their account
SLACK_REDIRECT=https://google.com
```

The result from a successful authentication is provided in the query params of the redirect.

## Development

If you find an issue, feel free to [open an issue](https://github.com/hcjk/micro-slack-auth/issues). 

```shell
git clone git@github.com:hcjk/micro-slack-auth.git
npm run dev
```

## License

Copyright (c) 2017 Henry Kaufman, licensed under the MIT license. See [LICENSE.md](https://github.com/hcjk/micro-slack-auth/blob/master/LICENSE) for more information.