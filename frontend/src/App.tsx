import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Dashboard } from './pages/Dashboard';
import { TTSTool } from './pages/TTSTool';
import { STTTool } from './pages/STTTool';
import LessonExercise from './pages/LessonExercise';
import Help from './pages/Help';
import SignCamera from './pages/SignCamera';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

const queryClient = new QueryClient();

// Helper to get identity from localStorage (Internet Identity stores it there)
function getStoredIdentity(): boolean {
  try {
    // Check if there's a stored II session
    const keys = Object.keys(localStorage);
    return keys.some(k => k.includes('identity') || k.includes('delegation') || k.includes('ii-'));
  } catch {
    return false;
  }
}

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const ttsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tts',
  component: TTSTool,
});

const sttRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stt',
  component: STTTool,
});

const lessonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lesson/$lessonId',
  component: LessonExercise,
});

const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help',
  component: Help,
});

const signCameraRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sign-camera',
  validateSearch: (search: Record<string, unknown>) => ({
    target: typeof search.target === 'string' ? search.target : undefined,
  }),
  component: SignCamera,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignUp,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  ttsRoute,
  sttRoute,
  lessonRoute,
  helpRoute,
  signCameraRoute,
  loginRoute,
  signupRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
