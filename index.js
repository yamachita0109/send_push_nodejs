// @see https://gist.github.com/tmarshall/6149ed2475f964cda3f5
require('dotenv').config()
const AWS = require('aws-sdk')

AWS.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.SNS_REGION
})

const sns = new AWS.SNS()

// TODO: select os
sns.createPlatformEndpoint({
  PlatformApplicationArn: process.env.APPLICATION_ARN_ANDROID,
  Token: 'app token'
}, function (err, data) {
  if (err) {
    console.log(err.stack)
    return
  }

  /*
   * ios payload
   * {
   *   "APNS_SANDBOX": {
   *     aps: {
   *       alert: "node js から送信",
   *       content-available: 1
   *     }
   *   }
   * }
   */
  let payload = {
    GCM: {
      data: {
        message: 'node js から送信'
      }
    }
  }
  // first have to stringify the inner APNS object...
  payload.GCM = JSON.stringify(payload.GCM)
  // then have to stringify the entire message payload
  payload = JSON.stringify(payload)

  const endpointArn = data.EndpointArn
  console.log('endpointArn')
  console.log(endpointArn)

  console.log('sending push')
  sns.publish({
    Message: payload,
    MessageStructure: 'json',
    TargetArn: endpointArn
  }, function (err, data) {
    if (err) {
      console.log(err.stack)
      return
    }

    console.log('push sent')
    console.log(data)
  })
})