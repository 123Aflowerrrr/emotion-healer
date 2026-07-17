import { useState, useEffect, useRef } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useChatStore } from '../../stores/useChatStore';
import { useSceneStore } from '../../stores/useSceneStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useAnimalStore } from '../../stores/useAnimalStore';

const QUICK_PROMPTS = [
  '我今天心情不太好... 😔',
  '最近总是觉得很焦虑',
  '想和你随便聊聊 🌸',
  '有什么放松的方法吗？',
];

export function ChatSheet() {
  const { activeSheet, closeSheet, openSheet } = useUIStore();
  const {
    sessions,
    activeSessionId,
    isStreaming,
    sendMessage,
    createSession,
    cancelStreaming,
    getActiveSession,
  } = useChatStore();
  const currentSceneId = useSceneStore((s) => s.currentSceneId);
  const isAIConfigured = useSettingsStore((s) => s.isAIConfigured());
  const activeCompanion = useAnimalStore((s) => s.activeCompanion);

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isOpen = activeSheet === 'chat';
  const activeSession = getActiveSession();

  useEffect(() => {
    if (isOpen && !activeSessionId && currentSceneId) {
      createSession(currentSceneId);
    }
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isOpen, activeSessionId, currentSceneId, createSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, activeSession?.messages]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    const msg = input.trim();
    setInput('');
    await sendMessage(msg);
  };

  const handleAPISetup = () => {
    closeSheet();
    setTimeout(() => openSheet('settings'), 300);
  };

  const messages = activeSession?.messages || [];

  return (
    <>
      <div className="sheet-overlay" onClick={closeSheet} />
      <div className="sheet-content animate-slide-up" style={{ height: '85vh' }}>
        <div className="drag-handle" />

        {/* Chat header */}
        <div className="flex items-center justify-between px-5 py-2 border-b border-warm-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{activeCompanion?.emoji || '🐱'}</span>
            <div>
              <p className="text-sm font-medium text-warm-700">
                和 {activeCompanion?.name || '小橘'} 聊聊
              </p>
              <p className="text-xs text-warm-400">AI 情感陪伴</p>
            </div>
          </div>
          {!isAIConfigured && (
            <button
              onClick={handleAPISetup}
              className="text-xs text-warm-500 underline"
            >
              配置API
            </button>
          )}
        </div>

        {/* Messages */}
        {!isAIConfigured ? (
          <div className="flex flex-col items-center justify-center h-[60%] px-8 text-center">
            <span className="text-5xl mb-4">🔑</span>
            <p className="text-warm-600 font-medium mb-2">还没有配置 AI 伙伴</p>
            <p className="text-sm text-warm-400 mb-6">
              在设置中配置 AI 接口（支持豆包、OpenAI 等），就可以和你的小动物伙伴聊天了
            </p>
            <button onClick={handleAPISetup} className="warm-btn">
              去配置 →
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ maxHeight: 'calc(85vh - 180px)' }}>
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-warm-400 text-sm mb-4">你的小动物伙伴在这里等你 💛</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => { setInput(prompt); inputRef.current?.focus(); }}
                        className="px-3 py-1.5 bg-warm-50 border border-warm-100 rounded-full text-xs text-warm-500 hover:bg-warm-100 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <span className="text-xl mr-2 mt-1">{activeCompanion?.emoji || '🐱'}</span>
                  )}
                  <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                      {isStreaming && msg.content === '' && (
                        <span className="inline-flex gap-1">
                          <span className="w-1.5 h-1.5 bg-warm-400 rounded-full animate-pulse-soft" style={{ animationDelay: '0s' }} />
                          <span className="w-1.5 h-1.5 bg-warm-400 rounded-full animate-pulse-soft" style={{ animationDelay: '0.2s' }} />
                          <span className="w-1.5 h-1.5 bg-warm-400 rounded-full animate-pulse-soft" style={{ animationDelay: '0.4s' }} />
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/90 backdrop-blur-sm border-t border-warm-100 safe-bottom">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="说说你的感受..."
                  disabled={isStreaming}
                  className="flex-1 px-4 py-2.5 rounded-full bg-warm-50 border border-warm-100 text-sm text-warm-700 placeholder-warm-300
                    focus:outline-none focus:border-warm-300 disabled:opacity-50"
                />
                {isStreaming ? (
                  <button
                    onClick={cancelStreaming}
                    className="px-4 py-2.5 rounded-full bg-red-100 text-red-500 text-sm font-medium"
                  >
                    停止
                  </button>
                ) : (
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="px-4 py-2.5 rounded-full bg-warm-400 text-white text-sm font-medium disabled:opacity-40 transition-opacity"
                  >
                    发送
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
