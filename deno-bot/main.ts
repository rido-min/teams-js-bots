import process from 'node:process'
import express from 'npm:express'

import {
  CloudAdapter,
  ConfigurationServiceClientCredentialFactory,
  createBotFrameworkAuthenticationFromConfiguration
} from 'npm:botbuilder'

import { MyBot } from "./bot.ts";

const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
  MicrosoftAppId: process.env.MicrosoftAppId,
  MicrosoftAppPassword: process.env.MicrosoftAppPassword,
  MicrosoftAppType: process.env.MicrosoftAppType || 'MultiTenant',
  MicrosoftAppTenantId: process.env.MicrosoftAppTenantId || ''
})

// @ts-ignore bug
const botFrameworkAuthentication = createBotFrameworkAuthenticationFromConfiguration(null, credentialsFactory)
const adapter = new CloudAdapter(botFrameworkAuthentication)
const myBot = new MyBot()

const server = express()
server.use(express.json())

const port = process.env.port || process.env.PORT || 3978
server.listen(port, () => {
  console.log(`\n listening in port ${port} v2 `)
})

server.post('/api/messages', async (req: express.Request, res: express.Response) => {
  console.log(req.body)
  await adapter.process(req, res, (context) => myBot.run(context))
})