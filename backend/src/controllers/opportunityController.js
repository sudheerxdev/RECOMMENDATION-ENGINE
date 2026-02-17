import { OPPORTUNITY_CATALOG } from '../data/opportunityCatalog.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const splitCsv = (value = '') =>
  value
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

const matchesAny = (targetText, queries) => {
  if (!queries.length) {
    return true;
  }
  return queries.some((query) => targetText.includes(query));
};

const applyFilters = (catalog, query) => {
  const search = query.q?.trim()?.toLowerCase() || '';
  const type = query.type || 'all';
  const experienceLevel = query.experienceLevel || 'all';
  const workMode = query.workMode || 'all';
  const roleFilters = splitCsv(query.roles);
  const skillFilters = splitCsv(query.skills);

  return catalog.filter((item) => {
    if (type !== 'all' && item.type !== type) {
      return false;
    }

    if (experienceLevel !== 'all' && item.experienceLevel !== experienceLevel) {
      return false;
    }

    if (workMode !== 'all' && item.workMode !== workMode) {
      return false;
    }

    if (roleFilters.length && !matchesAny(item.title.toLowerCase(), roleFilters)) {
      return false;
    }

    if (skillFilters.length && !skillFilters.some((skill) => item.skills.map((entry) => entry.toLowerCase()).includes(skill))) {
      return false;
    }

    if (!search) {
      return true;
    }

    const searchable = [
      item.title,
      item.company,
      item.location,
      item.description,
      item.type,
      item.experienceLevel,
      item.workMode,
      ...item.skills,
      ...item.tracks
    ]
      .join(' ')
      .toLowerCase();

    return searchable.includes(search);
  });
};

const sortByLatest = (items) =>
  items.slice().sort((left, right) => new Date(right.postedAt).getTime() - new Date(left.postedAt).getTime());

const fetchPrimaryOpportunityFeed = async (query) => {
  if (query.source === 'unstable') {
    throw new Error('Primary opportunity provider unavailable');
  }
  return sortByLatest(applyFilters(OPPORTUNITY_CATALOG, query));
};

export const listOpportunities = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 24;
  const offset = req.query.offset || 0;

  let filtered;
  let fallbackUsed = false;

  try {
    filtered = await fetchPrimaryOpportunityFeed(req.query);
  } catch (_error) {
    filtered = sortByLatest(applyFilters(OPPORTUNITY_CATALOG, req.query));
    fallbackUsed = true;
  }

  const paginated = filtered.slice(offset, offset + limit);
  const hasMore = offset + limit < filtered.length;

  res.json({
    success: true,
    fallbackUsed,
    data: paginated,
    meta: {
      total: filtered.length,
      limit,
      offset,
      hasMore,
      catalogSize: OPPORTUNITY_CATALOG.length
    }
  });
});
