require('dotenv').config()
const qs = require('qs')
const axios = require('axios')
const { router, get } = require('microrouter')
const redirect = require('micro-redirect')
const uid = require('uid-promise')

const slackUrl = 'https://slack.com/'

const states = []

const redirectWithQueryString = (res, data) => {
  const location = `${process.env.SLACK_REDIRECT}?${qs.stringify(data)}`
  redirect(res, 302, location)
}

const login = async (req, res) => {
  if (!process.env.SLACK_CLIENT_ID || !process.env.SLACK_CLIENT_SECRET || !process.env.SLACK_REDIRECT) {
    return console.error('In order to request an access token from slack, you must supply a SLACK_CLIENT_ID, a SLACK_CLIENT_SECRET, and a SLACK_REDIRECT.')
  }

  const state = await uid(20)
  states.push(state)

  const qsParams = {
    client_id: process.env.SLACK_CLIENT_ID,
    redirect_uri: 'http://localhost:3000/callback',
    scope: 'channels:history channels:read',
    response_type: 'code',
    state
  }
  const location = `${slackUrl}oauth/authorize?${qs.stringify(qsParams)}`

  redirect(res, 302, location)
}

const callback = async (req, res) => {
  const { code, state } = req.query

  if (!code || !state) {
    return redirectWithQueryString(res, {
      error: 'A response code and a state are required in order to authorize.'
    })
  }
  if (!states.includes(state)) {
    return redirectWithQueryString(res, {
      error: 'States must include the authorized state created in the login function.'
    })
  }
  const qsParams = {
    code,
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET
  }

  axios({
    method: 'post',
    url: `${slackUrl}api/oauth.access?${qs.stringify(qsParams)}`
  })
  .then((response) => {
    const data = qs.parse(response.data)

    return redirectWithQueryString(res, data)
  })
  .catch((err) => {
    console.error(err)
    return redirectWithQueryString(res, err)
  })
}

module.exports = router(
  get('/login', login),
  get('/callback', callback)
)
