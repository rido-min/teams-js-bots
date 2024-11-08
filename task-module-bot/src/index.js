// @ts-check

const express = require('express')

const {
  CloudAdapter,
  ConfigurationServiceClientCredentialFactory,
  createBotFrameworkAuthenticationFromConfiguration
} = require('botbuilder')

const { TeamsTaskModuleBot } = require('./bot')

const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
  MicrosoftAppId: process.env.MicrosoftAppId,
  MicrosoftAppPassword: process.env.MicrosoftAppPassword,
  MicrosoftAppType: process.env.MicrosoftAppType || 'MultiTenant',
  MicrosoftAppTenantId: process.env.MicrosoftAppTenantId || ''
})

// @ts-ignore
const botFrameworkAuthentication = createBotFrameworkAuthenticationFromConfiguration(null, credentialsFactory)
const adapter = new CloudAdapter(botFrameworkAuthentication)
const myBot = new TeamsTaskModuleBot()

const server = express()
server.use(express.json())
server.use(express.static('pages'))

const port = process.env.port || process.env.PORT || 3978
server.listen(port, () => {
  console.log(`\n listening in port ${port} v2 `)
})

server.get('/getAppConfig', (req, res,next) => {
  var responseMessageData = {
      MicrosoftAppId: process.env.MicrosoftAppId
  }
  res.send(responseMessageData)
})

server.post('/api/messages', async (req, res) => {
  console.log(req.body)
  await adapter.process(req, res, (context) => myBot.run(context))
})
