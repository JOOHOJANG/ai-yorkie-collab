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
 * `AIWriter`
 */
export class AIWriter<T> {
  _gptKey: string;
_initialized = false
  _messages: Array<{ role: TRole; content: string }> = [
    {
      role: 'system',
      content:
        '지금부터 내가 입력하는 문장을 영어로 번역해줘. 너의 대답은 번역된 텍스트만 포함하고 있어야해. 다른 말은 추가하면 안돼. 그리고 너의 답변에 개행문자가 들어가면 안돼. 하나의 문장으로 답변해.',
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
        initialPresence: { userId: 'translator' },
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
  public async generate(query: string, path: number[]) {
    const res = await this._fetch(query);
    const { content } = res.choices[0].message;

    if (!content.length) {
      return;
    }

    this._client.changeSyncMode(this._doc, SyncMode.RealtimePushOnly);


    const lines = (content as string).split('\n').flatMap((line) => {
      let index = 0;
      const arr = [''];

      while (index < line.length) {
        arr.push(line.slice(index, index + 3));
        index += 3;
      }

      return arr;
    });

    let index = 0;
    let textIndex = 0;
    const compIndex = path[0];
    let paraIndex = path[1];
    const revealText = () => {
      if (lines[index] === '') {
        this._doc.update((root) => {
          (root as any).text.editByPath(
            [compIndex, paraIndex],
            [compIndex, paraIndex],
            EMPTY_PARA,
          );
        });
      } else {
        if (lines[index].length) {
          this._doc.update((root, presence) => {
            const path = [compIndex, paraIndex, 0, textIndex];

            (root as any).text.editByPath(path, path, {
              type: 'text',
              value: lines[index],
            });

            const newPath = [
              compIndex,
              paraIndex,
              0,
              textIndex + lines[index].length,
            ];

            presence.set({
              selections: [
                (root as any).text.pathRangeToPosRange([newPath, newPath]),
              ],
              userId: 'translator',
            });

            textIndex += lines[index].length;
          });
        }
      }
      index++;

      setTimeout(() => {
        if (index < lines.length) {
          revealText();
        } else {
          this._client.changeSyncMode(this._doc, SyncMode.Realtime);
          this._doc.update((root, presence) => {
            presence.set({ 
                userId: 'gpt', 
                selections: [
                (root as any).text.pathRangeToPosRange([[0,0,0,0,0],[0,0,0,0,0]]),
              ]});
          });
          return Promise.resolve();
        }
      }, DELAY);
    };

    revealText();
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
