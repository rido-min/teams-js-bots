// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const express = require('express');

const {
    CloudAdapter,
    ConfigurationServiceClientCredentialFactory,
    createBotFrameworkAuthenticationFromConfiguration
  } = require('botbuilder')

// Import bot definitions
const { BotActivityHandler } = require('./botActivityHandler');


const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
    MicrosoftAppId: process.env.MicrosoftAppId,
    MicrosoftAppPassword: process.env.MicrosoftAppPassword,
    MicrosoftAppType: process.env.MicrosoftAppType || 'MultiTenant',
    MicrosoftAppTenantId: process.env.MicrosoftAppTenantId || ''
  })
  
  // @ts-ignore
  const botFrameworkAuthentication = createBotFrameworkAuthenticationFromConfiguration(null, credentialsFactory)
  const adapter = new CloudAdapter(botFrameworkAuthentication)

adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError] unhandled error: ${ error }`);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Uncomment below commented line for local debugging.
    // await context.sendActivity(`Sorry, it looks like something went wrong. Exception Caught: ${error}`);

};

// Create bot handlers
const botActivityHandler = new BotActivityHandler();

// Create HTTP server.
const server = express();
server.use(express.json())
const port = process.env.port || process.env.PORT || 3978;
server.listen(port, () => 
    console.log(`\Bot/ME service listening at http://localhost:${port}`)
);

// Listen for incoming requests.
server.post('/api/messages', async (req, res) => {
    console.log(req.baseUrl, req.body)
    await adapter.process(req, res, (context) => botActivityHandler.run(context))
});
