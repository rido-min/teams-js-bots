// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UISettings } from './uisettings'
import { TaskModuleIds } from './taskmoduleids'

export const TaskModuleUIConstants = {
  YouTube: new UISettings(1000, 700, 'YouTube Video', TaskModuleIds.YouTube, 'YouTube'),
  CustomForm: new UISettings(510, 450, 'Custom Form', TaskModuleIds.CustomForm, 'Custom Form'),
  AdaptiveCard: new UISettings(400, 200, 'Adaptive Card: Inputs', TaskModuleIds.AdaptiveCard, 'Adaptive Card')
}


