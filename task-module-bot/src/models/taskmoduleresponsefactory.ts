// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TaskModuleResponse, TaskModuleTaskInfo } from "botbuilder"

export class TaskModuleResponseFactory {
  static createResponse (taskModuleInfoOrString: TaskModuleTaskInfo) : TaskModuleResponse {
    console.log('createResponse', taskModuleInfoOrString)
    if (typeof taskModuleInfoOrString === 'string') {
      return {
        task: {
          type: 'message',
          value: taskModuleInfoOrString
        }
      }
    }

    return {
      task: {
        type: 'continue',
        value: taskModuleInfoOrString
      }
    }
  }

  static toTaskModuleResponse (taskInfo: TaskModuleTaskInfo) : TaskModuleResponse {
    return TaskModuleResponseFactory.createResponse(taskInfo)
  }
}


