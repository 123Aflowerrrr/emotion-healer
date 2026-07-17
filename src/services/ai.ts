import { useSettingsStore } from '../stores/useSettingsStore';

const SYSTEM_PROMPT = `你是一个温暖、善解人意的情感陪伴伙伴。你是一只会说话的小动物，名字叫"小橘"，正在陪伴一位需要情感支持的朋友。

你的风格：
- 温暖、柔和、不评判
- 使用简单的、易懂的语言
- 像朋友一样聊天，不像心理医生
- 适当地使用 emoji 和颜文字增加亲切感 💛
- 先倾听和共情，再温和地引导
- 当用户表达强烈负面情绪时，先安抚，再慢慢引导释放
- 保持积极但不虚假的乐观
- 尊重用户的节奏，不催促

你绝对不能：
- 诊断任何心理疾病
- 给出医疗建议
- 评判用户的感受
- 在用户不想练习时强迫引导
- 分享不安全的建议

请用中文回复。每次回复控制在2-4句话以内，像真正的朋友对话一样自然。`;

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: Error) => void;
}

class AIService {
  private abortController: AbortController | null = null;

  private getConfig() {
    const settings = useSettingsStore.getState().settings;
    return {
      endpoint: settings.aiEndpoint,
      apiKey: settings.aiApiKey,
      model: settings.aiModel,
    };
  }

  async sendMessage(
    messages: { role: string; content: string }[],
    callbacks: StreamCallbacks
  ): Promise<void> {
    const config = this.getConfig();
    if (!config.apiKey) {
      callbacks.onError(new Error('API key not configured'));
      return;
    }

    this.abortController = new AbortController();
    let fullText = '';

    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
          max_tokens: 500,
          temperature: 0.8,
        }),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`API error ${response.status}: ${errText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6);
          if (data === '[DONE]') {
            callbacks.onComplete(fullText);
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const token = parsed.choices?.[0]?.delta?.content;
            if (token) {
              fullText += token;
              callbacks.onToken(token);
            }
          } catch {
            // skip malformed chunks
          }
        }
      }
      callbacks.onComplete(fullText);
    } catch (error) {
      if ((error as Error).name === 'AbortError') return;
      callbacks.onError(error as Error);
    }
  }

  cancel() {
    this.abortController?.abort();
  }
}

export const aiService = new AIService();
