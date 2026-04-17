import {
  getTenantScopedItem,
  getTenantScopedStorageKey,
} from "@/utility/tenantContext";

let _tagListCache = null;
let _tagListVersion = 0;
let _tagListCacheKey = "";

export function invalidateTagListCache() {
  _tagListCache = null;
  _tagListCacheKey = "";
  _tagListVersion++;
}

export function getTagListCached() {
  const scopedKey = getTenantScopedStorageKey("tagList");
  if (!_tagListCache || _tagListCacheKey !== scopedKey) {
    _tagListCache = getTenantScopedItem("tagList");
    _tagListCacheKey = scopedKey;
  }
  return _tagListCache;
}

export function useTagInfo(tagId, prop) {
  const allTags = getTagListCached();
  if (!allTags) return null;
  const tar = allTags[tagId];
  return tar ? tar[prop] : null;
}
