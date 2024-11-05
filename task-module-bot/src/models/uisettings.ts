// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export class UISettings {
  
  width: number
  height: number
  title: string
  id: string
  buttonTitle: string

  constructor (width: number, height: number, title: string, id: string, buttonTitle: string) {
    this.width = width
    this.height = height
    this.title = title
    this.id = id
    this.buttonTitle = buttonTitle
  }
}


