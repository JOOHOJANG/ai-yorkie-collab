import { Document, Client, SyncMode } from 'yorkie-js-sdk';
import axios from "axios"

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
export class AIImageSearch<T> {
  _gptKey: string;
  _searchKey: string;
  _searchSecret: string;
  _doc: Document<T>;
  _client: Client;
  _initialized = false
  constructor(gptKey: string, docKey: string, apiKey: string, host: string, searchKey: string, searchSecret: string) {
    this._gptKey = gptKey;
    this._searchKey = searchKey;
    this._searchSecret = searchSecret;
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

    const {link} = res[0]
    const {displayFormat, domain, fileName, fileSize, format, height, internalResource, originalHeight, originalWidth, path, width} = await imageUploader(link)
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

  private async _fetch(query: string) {
    const messages = [
      { role: 'system', content: '지금부터 내가 입력한 자연어를 검색 엔진에 맞는 용도로 바꿔줘야해. 그리고 모든 답변은 한국어로 해줘. 내가 무엇무엇을 검색해줘 라고 하면 그것을 검색창에 검색하기 위한 쿼리를 너가 만들어줘야해. 예를 들어 "발리 해변 사진 검색해줘" 라고 하면 "발리 해변 사진" 이라는 응답을 줘' },
      {
        role: "user", content: query
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

    const data = await response.json();
    const refinedQuery = data.choices[0].message.content.trim();

    console.log(refinedQuery);

    const searchUrl = "https://cors-anywhere.herokuapp.com/https://openapi.naver.com/v1/search/image";
    const imageResults = await axios.get(`${searchUrl}`, {
      method: "GET",
      headers: {
        'X-Naver-Client-Id': this._searchKey,
        'X-Naver-Client-Secret': this._searchSecret
      },
      params: {
        query: refinedQuery,
        sort: "sim",
        display: 1
      }
    });    
    return imageResults.data.items;
  }
}
