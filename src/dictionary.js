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

async function fetchLatestWord2Lemma() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/DQNEO/gospec/main/docs/word2lemma.json"
    );
    return await res.json();
  } catch (e) {
    console.error("failed to fetch word2lemma.json", e);
    throw e;
  }
}

function cacheDictionaryData(dic, word2lemma) {
  chrome.storage.local.set({ dic, word2lemma });
}

// loadCachedDictionaryData returns cached data object in the form of `{ dic, word2lemma }`
async function loadCachedDictionaryData() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["dic", "word2lemma"], resolve);
  });
}

async function loadDictionaryData() {
  // load latest dictionary
  try {
    const [dic, word2lemma] = await Promise.all([
      fetchLatestDic(),
      fetchLatestWord2Lemma(),
    ]);
    cacheDictionaryData(dic, word2lemma);
    return { dic, word2lemma };
  } catch {
    // error handlings are done in each functions
  }

  // load cached dictionary
  const cache = await loadCachedDictionaryData();
  if (cache.dic && cache.word2lemma) {
    return cache;
  }

  throw new Error("failed to load dictionary");
}

class Dictionary {
  async init() {
    const { dic, word2lemma } = await loadDictionaryData();
    this.dic = dic;
    this.word2lemma = word2lemma;
  }
  lookup(word) {
    const lemma = this.word2lemma[word.toLowerCase()];
    if (!lemma) {
      return "";
    }
    const meaning = this.dic[lemma];
    if (!meaning) {
      return "";
    }
    return meaning;
  }
}
