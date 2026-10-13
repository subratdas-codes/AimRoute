const PREFIX = "aimroute_quiz_";
const TTL = 7 * 24 * 60 * 60 * 1000;

export function getQuizCache(level) {
  try {
    const raw = localStorage.getItem(PREFIX + level);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.questions) || Date.now() - parsed.fetchedAt > TTL) {
      localStorage.removeItem(PREFIX + level);
      return null;
    }
    return parsed.questions;
  } catch {
    return null;
  }
}

export function setQuizCache(level, questions) {
  try {
    localStorage.setItem(
      PREFIX + level,
      JSON.stringify({ fetchedAt: Date.now(), questions })
    );
  } catch {
    // ignore quota/security errors
  }
}

export function prefetchQuizCache(levels, api) {
  levels.forEach((level) => {
    if (getQuizCache(level)) return;
    api
      .get(`/quiz/?level=${level}`)
      .then((r) => {
        const allQ = r.data.questions || r.data || [];
        setQuizCache(level, allQ.filter((q) => q && !q.is_start));
      })
      .catch(() => {});
  });
}