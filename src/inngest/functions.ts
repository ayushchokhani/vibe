
import {  openai, createAgent } from '@inngest/agent-kit'
import {Sandbox} from "@e2b/code-interpreter" 

import { inngest } from './client'
import { getSandbox } from './utils'

export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },

  async ({ event, step}) => {

    const sandboxId = await step.run("get-sandbox-id", async() => {
      const sandbox = await Sandbox.create('vibe-nextjs-ayush-test-2')
      return sandbox.sandboxId
    })

    const codeAgent = createAgent({
      name: 'code-agent',
      system: 'You are an expert developer.  You write readable maintainable code for react and nextjs components',
      model: openai({ model: 'gpt-4o' }),
    })

    const { output } = await codeAgent.run(
      `code the following component: ${event.data.value}`
    )

    const sandboxUrl = await step.run("get-sandbox-url", async() => {
      const sandbox = await getSandbox(sandboxId)
      const host = sandbox.getHost(3000)
      return `https://${host}`
    })

    // console.log(output)
    
    return { output, sandboxUrl }
  }
)
