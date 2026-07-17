import { useGreeting } from '../../hooks/useGreeting';

export function Greeting() {
  const { greeting, emoji, subtext } = useGreeting();

  return (
    <div className="text-center py-6 px-4">
      <div className="text-4xl mb-3 animate-float">{emoji}</div>
      <h1 className="text-2xl font-serif text-warm-800 font-medium mb-1">
        {greeting}
      </h1>
      <p className="text-warm-500 text-sm">{subtext}</p>
    </div>
  );
}
