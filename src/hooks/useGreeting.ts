import { useMemo } from 'react';

export function useGreeting(): { greeting: string; emoji: string; subtext: string } {
  return useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 9)
      return { greeting: '早上好', emoji: '🌅', subtext: '新的一天开始了，愿你被温柔以待' };
    if (hour >= 9 && hour < 12)
      return { greeting: '上午好', emoji: '☀️', subtext: '阳光正好，给自己一个微笑吧' };
    if (hour >= 12 && hour < 14)
      return { greeting: '中午好', emoji: '🍃', subtext: '记得吃午饭，也要记得照顾自己的心情' };
    if (hour >= 14 && hour < 18)
      return { greeting: '下午好', emoji: '🌤️', subtext: '下午的时光，适合泡杯茶，慢慢来' };
    if (hour >= 18 && hour < 22)
      return { greeting: '晚上好', emoji: '🌙', subtext: '夜幕降临了，今天辛苦了吗？' };
    return { greeting: '夜深了', emoji: '✨', subtext: '夜晚是和自己对话最好的时间' };
  }, []);
}
