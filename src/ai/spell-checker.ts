import { Document, Client, SyncMode } from 'yorkie-js-sdk';

const DELAY = 150;
const EMPTY_PARA = {
  type: 'paragraph',
  attributes: {
    '@ctype': 'paragraph',
  },
  children: [
    {
      type: 'node',
      attributes: {
        '@ctype': 'textNode',
      },
      children: [],
    },
  ],
};
type TRole = 'assistant' | 'user' | 'system';
/**
 * `AITranslator`
 */
export class AISpellChecker<T> {
  _gptKey: string;
_initialized = false
  _messages: Array<{ role: TRole; content: string }> = [
    {
      role: 'system',
      content:
        '지금부터 내가 입력하는 문장의 맞춤법을 교정해줘. 너의 대답은 교정된 텍스트만 포함하고 있어야해. 다른 말은 추가하면 안돼. 그리고 너의 답변에 개행문자가 들어가면 안돼. 하나의 문장으로 답변해.',
    },
  ];
  _doc: Document<T>;
  _client: Client;
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
        initialPresence: { userId: 'spellChecker' },
      });
      
      this._initialized = true
    } catch {
      return false;
    }

    return Promise.resolve();
  }

  /**
   *
   */
  public async generate(query: string, fromPath: number[], toPath: number[]) {
    this._client.changeSyncMode(this._doc, SyncMode.RealtimePushOnly);
    const res = await this._fetch(query);
    const { content } = res.choices[0].message;

    if (!content.length) {
      return;
    }

    this._client.changeSyncMode(this._doc, SyncMode.RealtimePushOnly);
    
    this._doc.update((root, presence) => {
        (root as any).text.editByPath(fromPath, toPath, {
            type: "text",
            value: content
        });

        const newPath = [...toPath]
        newPath.pop();
        newPath.push(content.length)
        presence.set({
            userId: "spellChecker",
            selections: [
                (root as any).text.pathRangeToPosRange([fromPath,newPath]),
              ]
        })
    })

    setTimeout(() => {
        this._doc.update((root, presence) => {
            presence.set({
                userId: "spellChecker",
                selections: [
                    (root as any).text.pathRangeToPosRange([[0,0,0,0,0],[0,0,0,0,0]]),
                  ]
            })
        })
    }, 1500)
  }

  private async _fetch(query: string) {
    this._messages.push({ role: 'user', content: query });
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this._gptKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // 모델 버전 선택
        messages: this._messages,
        temperature: 0.7, // 생성되는 텍스트의 다양성을 조절하는 파라미터
      }),
    });

    const res = await response.json();

    this._messages.push({
      role: 'assistant',
      content: res.choices[0].message.content,
    });

    return res;
  }
}
