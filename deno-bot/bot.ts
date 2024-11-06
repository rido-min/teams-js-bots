import { ActivityHandler, MessageFactory } from 'npm:botbuilder'

export class MyBot extends ActivityHandler {
    constructor() {
        super()
        this.onMembersAdded(async (ctx, next) => {
            ctx.sendActivity(MessageFactory.text('hello bot'))
            await next()
        })
        this.onMessage( async (ctx, next) => {
            const msg = ctx.activity.text
            ctx.sendActivity(MessageFactory.text(`echo ${msg}`))
            await next()
        })
    }
}