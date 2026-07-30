import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppProviders, AppRoutes } from "./App";

/**
 * Server entry used only at build time by scripts/prerender.mjs.
 *
 * Renders a route to static HTML so the deployed pages ship real body content
 * instead of an empty <div id="root">. Previously prerendering only rewrote
 * <head> tags, so every crawler that does not execute JavaScript — which is
 * all of GPTBot, PerplexityBot, ClaudeBot, ChatGPT-User and OAI-SearchBot,
 * the very agents robots.txt invites in — saw a blank page.
 *
 * The client still hydrates normally; this markup is what a non-JS fetch gets.
 */
export function render(url: string): string {
  return renderToString(
    <AppProviders withToasters={false}>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </AppProviders>
  );
}
