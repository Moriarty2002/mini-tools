import { useState, useEffect, useCallback } from 'react';

export interface RouteState {
  rawHash: string;
  path: string;
  toolSlug: string | null;
  queryParams: Record<string, string>;
}

export function parseHash(hashString: string): RouteState {
  // Strip starting # or #/
  const clean = hashString.replace(/^#\/?/, '');
  const [pathPart, queryPart] = clean.split('?');

  const segments = (pathPart || '').split('/').filter(Boolean);

  let toolSlug: string | null = null;
  if (segments.length > 0) {
    if (segments[0] === 'tools' && segments[1]) {
      toolSlug = segments[1];
    } else {
      toolSlug = segments[0];
    }
  }

  const queryParams: Record<string, string> = {};
  if (queryPart) {
    const searchParams = new URLSearchParams(queryPart);
    searchParams.forEach((val, key) => {
      queryParams[key] = val;
    });
  }

  return {
    rawHash: hashString,
    path: pathPart || '',
    toolSlug,
    queryParams,
  };
}

export function useHashRouter() {
  const [route, setRoute] = useState<RouteState>(() =>
    parseHash(typeof window !== 'undefined' ? window.location.hash : '')
  );

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((path: string, params?: Record<string, string>) => {
    let target = path.startsWith('/') ? path.slice(1) : path;
    if (params && Object.keys(params).length > 0) {
      const search = new URLSearchParams(params).toString();
      target = `${target}?${search}`;
    }
    window.location.hash = `#/${target}`;
  }, []);

  const navigateHome = useCallback(() => {
    window.location.hash = '#/';
  }, []);

  return {
    route,
    toolSlug: route.toolSlug,
    queryParams: route.queryParams,
    navigate,
    navigateHome,
  };
}
