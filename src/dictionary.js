async function fetchLatestDic() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/DQNEO/gospec/main/docs/dic.ja.json"
    );
    return await res.json();
  } catch (e) {
    console.error("failed to fetch dic.ja.json", e);
    throw e;
  }
}

async function fetchLatestWord2Stem() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/DQNEO/gospec/main/docs/word2stem.json"
    );
    return await res.json();
  } catch (e) {
    console.error("failed to fetch word2stem.json", e);
    throw e;
  }
}

function cacheDictionaryData(dic, word2stem) {
  chrome.storage.local.set({ dic, word2stem });
}

// loadCachedDictionaryData returns cached data object in the form of `{ dic, word2stem }`
async function loadCachedDictionaryData() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["dic", "word2stem"], resolve);
  });
}

async function loadDictionaryData() {
  // load latest dictionary
  try {
    const [dic, word2stem] = await Promise.all([
      fetchLatestDic(),
      fetchLatestWord2Stem(),
    ]);
    cacheDictionaryData(dic, word2stem);
    return { dic, word2stem };
  } catch {
    // error handlings are done in each functions
  }

  // load cached dictionary
  const cache = await loadCachedDictionaryData();
  if (cache.dic && cache.word2stem) {
    return cache;
  }

  throw new Error("failed to load dictionary");
}

class Dictionary {
  async init() {
    const { dic, word2stem } = await loadDictionaryData();
    this.dic = dic;
    this.word2stem = word2stem;
  }
  lookup(word) {
    const stem = this.word2stem[word.toLowerCase()];
    if (!stem) {
      return "";
    }
    const meaning = this.dic[stem];
    if (!meaning) {
      return "";
    }
    return meaning;
  }
}
