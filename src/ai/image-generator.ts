import { Document, Client, SyncMode } from 'yorkie-js-sdk';

const EMPTY_TEXT = {
  attributes: {
    "@ctype": "textUnit"
  },
  children: [{
    attributes: {
      "@ctype": "paragraph"
    },
    children: [{
      attributes: {
        "@ctype": "textNode"
      },
      type: "node",
      children: []
    }],
    type: "paragraph"
  }],
  type: "unit"
}

/**
 * `AIWriter`
 */
export class AIImageGenerator<T> {
  _gptKey: string;
  _doc: Document<T>;
  _client: Client;
  _initialized = false
  constructor(gptKey: string, docKey: string, apiKey: string, host: string) {
    this._gptKey = gptKey;
    this._doc = new Document(docKey, {
      disableGC: true,
    });
    this._client = new Client(`https://${host}`, {
      apiKey,
    });
  }

  /** */
  public async initialize() {
    if (this._initialized) {
      return Promise.resolve()
    }

    try {
      await this._client.activate();
      await this._client.attach(this._doc, {
        initialPresence: { userId: 'imageSearch' },
      });

      this._initialized = true;
    } catch {
      return false;
    }

    return Promise.resolve();
  }

  /**
   *
   */
  public async generate(query: string, compIndex = 0, imageUploader: (data: string) => any) {
    this._client.changeSyncMode(this._doc, SyncMode.RealtimePushOnly);
    const res = await this._fetch(query);

    if (!res.length) {
      this._client.changeSyncMode(this._doc, SyncMode.Realtime);
      return;
    }

    const {displayFormat, domain, fileName, fileSize, format, height, internalResource, originalHeight, originalWidth, path, width} = await imageUploader(res)
    const imageData = {
      attributes: {
        "@ctype": "image",
        contentMode: "normal",
        imageData: {
          displayFormat,
          domain,
          fileName,
          fileSize,
          format,
          height,
          internalResource,
          origin: {
            "@ctype": "imageOrigin",
            "srcFrom": "copyUrl",
          },
          originalHeight,
          originalWidth,
          path,
          src: domain + path,
          width
        },
        layout: "default",
        linkTagData: {
          link: "",
          mediaTags: []
        },
        represent: false
      },
      children: [EMPTY_TEXT]
    }

    this._doc.update((root) => {
      (root as any).text.editByPath([compIndex], [compIndex], imageData)
    })
    
    this._client.changeSyncMode(this._doc, SyncMode.Realtime);
  }

  private async _fetch(context: string) {
    const messages = [
      { role: 'system', content: '지금부터 내가 입력하는 텍스트에서 키워드를 뽑아서 dall e 에서 사진 생성이 가능하도록 키워드를 뽑아줘' },
      {
        role: "user", content: context
      }
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this._gptKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        temperature: 0.2, // 텍스트 정제는 창의성보다는 정확성이 중요하므로 낮은 온도를 설정
      }),
    });
    const res = await response.json()
    const query  = res.choices[0].content

    console.log(res)
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this._gptKey}`
        },
        body: JSON.stringify({
            prompt: query,
            n: 1, // 이미지 개수
            size: "1024x1024" // 이미지 크기
        })
    });

    if (!imageResponse.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;

    return imageUrl
  }
}
