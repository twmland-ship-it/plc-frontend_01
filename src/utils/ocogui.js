export function getDefaultOcoguiServerUrl(port = 2955) {
  const envUrl = process.env.VUE_APP_OCOGUI_URL;
  if (envUrl) return String(envUrl).trim().replace(/\/+$/, "");

  if (typeof window !== "undefined" && window.location) {
    const proto = window.location.protocol || "http:";
    const host = window.location.hostname || "localhost";
    return `${proto}//${host}:${port}`;
  }

  return `http://localhost:${port}`;
}

export function normalizeOcoguiServerUrl(url, portFallback = 2955) {
  const normalized = String(url || "")
    .trim()
    .replace(/\/+$/, "");
  return normalized || getDefaultOcoguiServerUrl(portFallback);
}

function extractViewNameFromHash(hash) {
  const normalizedHash = String(hash || "");
  if (!normalizedHash.startsWith("#/")) return { viewName: "", routeKind: "unknown" };

  const [hashPath, hashQuery = ""] = normalizedHash.split("?", 2);
  const params = new URLSearchParams(hashQuery);
  const queryViewName = params.get("name") || params.get("viewName") || "";

  if (hashPath === "#/view") {
    return { viewName: queryViewName, routeKind: "viewer" };
  }

  if (hashPath === "#/editor") {
    return { viewName: queryViewName, routeKind: "editor" };
  }

  if (hashPath.startsWith("#/home/")) {
    return {
      viewName: decodeURIComponent(hashPath.slice("#/home/".length)),
      routeKind: "home",
    };
  }

  if (hashPath === "#/home") {
    return { viewName: queryViewName, routeKind: "home" };
  }

  return { viewName: queryViewName, routeKind: "unknown" };
}

export function buildOcoguiViewerUrl(serverUrl, viewName) {
  const normalizedServerUrl = normalizeOcoguiServerUrl(serverUrl);
  const trimmedViewName = String(viewName || "").trim();
  if (!trimmedViewName) {
    return normalizedServerUrl;
  }

  const url = new URL(normalizedServerUrl);
  url.pathname = "/";
  url.search = "";
  url.hash = `#/view?name=${encodeURIComponent(trimmedViewName)}`;
  return url.toString();
}

export function normalizeOcoguiViewerUrl(rawUrl, serverUrl, _options = {}) {
  const normalizedServerUrl = normalizeOcoguiServerUrl(serverUrl);
  const result = {
    url: "",
    serverUrl: normalizedServerUrl,
    viewName: "",
    routeKind: "empty",
    isViewer: false,
    isLegacy: false,
    warnings: [],
  };

  const trimmedRawUrl = String(rawUrl || "").trim();
  if (!trimmedRawUrl) {
    return result;
  }

  try {
    const base = new URL(normalizedServerUrl);
    const parsed = new URL(trimmedRawUrl, base.origin);
    parsed.protocol = base.protocol;
    parsed.host = base.host;

    const pathnameMatch = parsed.pathname.match(/^\/view\/([^/?#]+)/);
    if (pathnameMatch) {
      result.viewName = decodeURIComponent(pathnameMatch[1]);
      result.routeKind = "path-view";
    } else {
      const hashInspection = extractViewNameFromHash(parsed.hash);
      result.viewName = hashInspection.viewName;
      result.routeKind = hashInspection.routeKind;
    }

    if (result.viewName) {
      result.isViewer = result.routeKind === "viewer";
      result.isLegacy = result.routeKind !== "viewer";
      result.url = buildOcoguiViewerUrl(base.origin, result.viewName);

      if (result.routeKind === "home" || result.routeKind === "editor") {
        result.warnings.push("此 URL 原本使用 GUI shell 路徑，已轉為純 Viewer。");
      } else if (result.routeKind === "path-view") {
        result.warnings.push("此 URL 使用舊版 /view/<name> 路徑，已轉為標準 Viewer。");
      }

      return result;
    }

    parsed.hash = "";
    result.url = parsed.toString();
    result.warnings.push("此 URL 不是純 Viewer 規格，儲存後不保證可避免 GUI shell/auth 流程。");
    return result;
  } catch (_error) {
    result.url = trimmedRawUrl;
    result.routeKind = "invalid";
    result.warnings.push("此 URL 無法解析，請改用 OCOGUI Viewer 連結。");
    return result;
  }
}


