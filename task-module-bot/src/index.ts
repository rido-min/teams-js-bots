// @ts-check

import express from 'express'

import {
  CloudAdapter,
  ConfigurationServiceClientCredentialFactory,
  createBotFrameworkAuthenticationFromConfiguration
} from 'botbuilder'

import { TeamsTaskModuleBot } from './bot'

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

server.get('/getAppConfig', (req: express.Request, res : express.Response) => {
  var responseMessageData = {
      MicrosoftAppId: process.env.MicrosoftAppId
  }
  res.send(responseMessageData)
})

server.post('/api/messages', async (req: express.Request, res: express.Response) => {
  console.log(req.body)
  await adapter.process(req, res, (context) => myBot.run(context))
})
