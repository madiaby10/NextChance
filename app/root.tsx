import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { useEffect, useState } from "react";
import {
  getCurrentUser,
  signIn as puterSignIn,
  signOut as puterSignOut,
} from "../lib/puter.action";

export const links: Route.LinksFunction = () => [];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
      {children}
      <ScrollRestoration />
      <Scripts />
      </body>
      </html>
  );
}

const DEFAULT_AUTH_STATE: AuthState = {
  isSignedIn: false,
  userName: null,
  userId: null,
};

export default function App() {
  const [authState, setAuthState] = useState<AuthState>(DEFAULT_AUTH_STATE);

  const refreshAuth = async () => {
    try {
      const user = await getCurrentUser();

      setAuthState({
        isSignedIn: !!user,
        userName: (user as any)?.username || null,
        userId: (user as any)?.uuid || null,
      });

      return !!user;
    } catch {
      setAuthState(DEFAULT_AUTH_STATE);
      return false;
    }
  };

  useEffect(() => {
    void refreshAuth();
  }, []);

  const signIn = async () => {
    await puterSignIn();
    return await refreshAuth();
  };

  const signOut = async () => {
    await puterSignOut();
    return await refreshAuth();
  };

  return (
      <main className="min-h-screen bg-background text-foreground relative z-10">
        <Outlet
            context={{
              ...authState,
              refreshAuth,
              signIn,
              signOut,
            }}
        />
      </main>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
        error.status === 404
            ? "The requested page could not be found."
            : error.statusText || details;
  } else if (import.meta.env.DEV && error && typeof error === "object" && "stack" in error) {
    stack = String((error as any).stack);
  }

  return (
      <main className="min-h-screen bg-background text-foreground p-6">
        <h1 className="text-2xl font-bold">{message}</h1>
        <p className="mt-2 text-zinc-600">{details}</p>
        {stack && (
            <pre className="mt-4 p-4 bg-zinc-100 rounded-lg overflow-x-auto text-xs">
          {stack}
        </pre>
        )}
      </main>
  );
}