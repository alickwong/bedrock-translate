import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
  InvokeModelWithResponseStreamCommandInput
} from "@aws-sdk/client-bedrock-runtime";
import {ModelId} from "../enum/ModelId";

let lang = 'zh'

export class BedRock {
  private client: BedrockRuntimeClient;
  private bedrockApiMaxRetries = 10;
  private bedrockApiRetryDelay = 3000;

  constructor() {
    this.client = new BedrockRuntimeClient();
  }

  async bedrockStreamingApi(prompt: string, modelId: ModelId) {
    let payload = {
      "anthropic_version": "bedrock-2023-05-31",
      "max_tokens": 100000,
      "temperature": 0,
      "top_k": 1,
      "messages": [
        {
          "role": "user",
          "content": [{"type": "text", "text": prompt}]
        }
      ],
      // "sessionState": sessionState
    };
    const params: InvokeModelWithResponseStreamCommandInput = {
      modelId: modelId,
      body: JSON.stringify(payload),
      contentType: "application/json"
    };
    const command = new InvokeModelWithResponseStreamCommand(params);
    const res = await this.client.send(command);
    const chunks: string[] = [];

    await new Promise(resolve => setTimeout(resolve, 2000));

    if (res) {
      await this.processWithRetry(chunks, res, 0);

      return chunks.join('')
        .replace(/^.*\n/, '');
      // return chunks.join('');
      ;
    }

    return;
  }

  async processWithRetry(chunks: string[], res: any, retries = 0, extraLatencyInMs = 0): Promise<void>{
    try {
      for await (const event of res?.body ?? []) {
        // Sleep for 50ms
        // await new Promise(resolve => setTimeout(resolve, 100));

        if (event.chunk && event.chunk.bytes) {
          // Sleep for 50ms
          await new Promise(resolve => setTimeout(resolve, extraLatencyInMs));

          const translatedChunk = JSON.parse(Buffer.from(event.chunk.bytes).toString("utf-8"));
          if (translatedChunk) {
            chunks.push(translatedChunk?.delta?.text);
            // console.log(translatedChunk?.delta?.text);
          }
        } else if (
          event.internalServerException ||
          event.modelStreamErrorException ||
          event.throttlingException ||
          event.validationException
        ) {
          console.error(event);
          throw new Error('Event processing error');
        }
      }
    } catch (error) {
      if (retries < this.bedrockApiMaxRetries) {
        console.error(`Error processing events. Retrying in ${this.bedrockApiRetryDelay}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, this.bedrockApiRetryDelay));
        return this.processWithRetry(chunks, res, retries + 1, 100);
      } else {
        console.error('Max retries reached. Aborting event processing.', error);
        throw error;
      }
    }
  }
}