import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { useEmotionStore } from './stores/useEmotionStore';
import { useReleaseStore } from './stores/useReleaseStore';
import { useSettingsStore } from './stores/useSettingsStore';

const SceneSelectionPage = lazy(() => import('./pages/SceneSelectionPage').then(m => ({ default: m.SceneSelectionPage })));
const ScenePage = lazy(() => import('./pages/ScenePage').then(m => ({ default: m.ScenePage })));
const ReleasePage = lazy(() => import('./pages/ReleasePage').then(m => ({ default: m.ReleasePage })));

function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-50">
      <div className="text-center">
        <div className="text-3xl animate-float mb-3">🌸</div>
        <p className="text-warm-400 text-sm">加载中...</p>
      </div>
    </div>
  );
}

function App() {
  const loadEntries = useEmotionStore((s) => s.loadEntries);
  const loadSedonaSessions = useReleaseStore((s) => s.loadSessions);
  const loadSettings = useSettingsStore((s) => s.loadSettings);

  useEffect(() => {
    loadSettings();
    loadEntries();
    loadSedonaSessions();
  }, [loadEntries, loadSedonaSessions, loadSettings]);

  return (
    <BrowserRouter basename="/emotion-healer">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={
            <Suspense fallback={<PageLoading />}>
              <SceneSelectionPage />
            </Suspense>
          } />
          <Route path="/scene/:sceneId" element={
            <Suspense fallback={<PageLoading />}>
              <ScenePage />
            </Suspense>
          } />
          <Route path="/release" element={
            <Suspense fallback={<PageLoading />}>
              <ReleasePage />
            </Suspense>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
