// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TeamsActivityHandler, MessageFactory, CardFactory, TurnContext, TaskModuleRequest, TaskModuleResponse, Attachment, TaskModuleTaskInfo } from 'botbuilder'
import { TaskModuleUIConstants } from './models/taskmoduleuiconstants'
import { TaskModuleIds } from './models/taskmoduleids'
import { TaskModuleResponseFactory } from './models/taskmoduleresponsefactory'
import { UISettings } from './models/uisettings'

const Actions = [
  TaskModuleUIConstants.AdaptiveCard,
  TaskModuleUIConstants.CustomForm,
  TaskModuleUIConstants.YouTube
]

export class TeamsTaskModuleBot extends TeamsActivityHandler {
  baseUrl: string | undefined
  constructor () {
    super()

    this.baseUrl = process.env.BaseUrl

    // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
    this.onMessage(async (context, next) => {
      // This displays two cards: A HeroCard and an AdaptiveCard.  Both have the same
      // options.  When any of the options are selected, `handleTeamsTaskModuleFetch`
      // is called.
      const reply = MessageFactory.list([
        this.getTaskModuleHeroCardOptions(),
        this.getTaskModuleAdaptiveCardOptions()
      ])
      await context.sendActivity(reply)

      // By calling next() you ensure that the next BotHandler is run.
      await next()
    })
  };




  async handleTeamsTaskModuleFetch (context: TurnContext, taskModuleRequest: TaskModuleRequest) : Promise<TaskModuleResponse> {
    // Called when the user selects an options from the displayed HeroCard or
    // AdaptiveCard.  The result is the action to perform.

    console.log('handleTeamsTaskModuleFetch', taskModuleRequest)

    const cardTaskFetchValue = taskModuleRequest.data.data
    const taskInfo : TaskModuleTaskInfo= {card: undefined, url: '', fallbackUrl: ''}
    

    if (cardTaskFetchValue === TaskModuleIds.YouTube) {
      // Display the YouTube.html page
      taskInfo.url = taskInfo.fallbackUrl = this.baseUrl + '/' + TaskModuleIds.YouTube + '.html'
      this.setTaskInfo(taskInfo, TaskModuleUIConstants.YouTube)
    } else if (cardTaskFetchValue === TaskModuleIds.CustomForm) {
      // Display the CustomForm.html page, and post the form data back via
      // handleTeamsTaskModuleSubmit.
      taskInfo.url = taskInfo.fallbackUrl = this.baseUrl + '/' + TaskModuleIds.CustomForm + '.html'
      this.setTaskInfo(taskInfo, TaskModuleUIConstants.CustomForm)
    } else if (cardTaskFetchValue === TaskModuleIds.AdaptiveCard) {
      // Display an AdaptiveCard to prompt user for text, and post it back via
      // handleTeamsTaskModuleSubmit.
      taskInfo.card = this.createAdaptiveCardAttachment()
      this.setTaskInfo(taskInfo, TaskModuleUIConstants.AdaptiveCard)
    }
    console.log(taskInfo)
    
    return TaskModuleResponseFactory.toTaskModuleResponse(taskInfo)
  }

  async handleTeamsTaskModuleSubmit (context : TurnContext, taskModuleRequest : TaskModuleRequest) : Promise<TaskModuleResponse> {
    
    console.log('handleTeamsTaskModuleSubmit', taskModuleRequest)
    // Called when data is being returned from the selected option (see `handleTeamsTaskModuleFetch').

    // Echo the users input back.  In a production bot, this is where you'd add behavior in
    // response to the input.
    await context.sendActivity(MessageFactory.text('handleTeamsTaskModuleSubmit: ' + JSON.stringify(taskModuleRequest.data)))

    // Return TaskModuleResponse
    return {
      // TaskModuleMessageResponse
      task: {
        type: 'message',
        value: 'Thanks!'
      }
    }
  }

  setTaskInfo (taskInfo : TaskModuleTaskInfo, uiSettings: UISettings) {
    taskInfo.height = uiSettings.height
    taskInfo.width = uiSettings.width
    taskInfo.title = uiSettings.title
  }

  getTaskModuleHeroCardOptions () : Attachment{
    return CardFactory.heroCard(
      'Dialog (referred as task modules in TeamsJS v1.x) Invocation from Hero Card',
      undefined,
      Actions.map((cardType) => {
        return {
          type: 'invoke',
          title: cardType.buttonTitle,
          value: {
            type: 'task/fetch',
            data: cardType.id
          }
        }
      })
    )
  }

  getTaskModuleAdaptiveCardOptions () {
    const adaptiveCard = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      version: '1.0',
      type: 'AdaptiveCard',
      body: [
        {
          type: 'TextBlock',
          text: 'Dialog (referred as task modules in TeamsJS v1.x) Invocation from Adaptive Card',
          weight: 'bolder',
          size: 3
        }
      ],
      actions: Actions.map((cardType) => {
        return {
          type: 'Action.Submit',
          title: cardType.buttonTitle,
          data: { msteams: { type: 'task/fetch' }, data: cardType.id }
        }
      })
    }

    return CardFactory.adaptiveCard(adaptiveCard)
  }

  createAdaptiveCardAttachment () {
    return CardFactory.adaptiveCard({
      version: '1.0.0',
      type: 'AdaptiveCard',
      body: [
        {
          type: 'TextBlock',
          text: 'Enter Text Here'
        },
        {
          type: 'Input.Text',
          id: 'usertext',
          placeholder: 'add some text and submit',
          IsMultiline: true
        }
      ],
      actions: [
        {
          type: 'Action.Submit',
          title: 'Submit'
        }
      ]
    })
  }
}

