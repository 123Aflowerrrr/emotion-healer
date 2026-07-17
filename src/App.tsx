import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { SceneSelectionPage } from './pages/SceneSelectionPage';
import { ScenePage } from './pages/ScenePage';
import { ReleasePage } from './pages/ReleasePage';
import { useEmotionStore } from './stores/useEmotionStore';
import { useChatStore } from './stores/useChatStore';
import { useReleaseStore } from './stores/useReleaseStore';
import { useSettingsStore } from './stores/useSettingsStore';

function App() {
  const loadEntries = useEmotionStore((s) => s.loadEntries);
  const loadSessions = useChatStore((s) => s.loadSessions);
  const loadSedonaSessions = useReleaseStore((s) => s.loadSessions);
  const loadSettings = useSettingsStore((s) => s.loadSettings);

  useEffect(() => {
    loadSettings();
    loadEntries();
    loadSessions();
    loadSedonaSessions();
  }, [loadEntries, loadSessions, loadSedonaSessions, loadSettings]);

  return (
    <BrowserRouter basename="/emotion-healer">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<SceneSelectionPage />} />
          <Route path="/scene/:sceneId" element={<ScenePage />} />
          <Route path="/release" element={<ReleasePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
