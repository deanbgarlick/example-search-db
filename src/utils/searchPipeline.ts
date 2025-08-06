import { USER_SEARCH_INDEX_NAME, USER_AUTOCOMPLETE_INDEX_NAME } from '../models/User'

export function buildSearchPipeline(searchQuery: string, country?: string) {
  const pipeline = []

  if (country) {
    pipeline.push({
      $search: {
        index: USER_SEARCH_INDEX_NAME,
        compound: {
          must: [
            {
              text: {
                query: searchQuery,
                path: ['fullName', 'email'],
                fuzzy: {},
              },
            },
            {
              text: {
                query: country,
                path: 'country',
              },
            },
          ],
        },
      },
    })
  } else {
    pipeline.push({
      $search: {
        index: USER_SEARCH_INDEX_NAME,
        text: {
          query: searchQuery,
          path: ['fullName', 'email'],
          fuzzy: {},
        },
      },
    })
  }

  pipeline.push(buildProjectionStage())
  return pipeline
}

export function buildAutocompletePipeline(searchQuery: string, country?: string) {
  const pipeline = []

  if (country) {
    pipeline.push({
      $search: {
        index: USER_SEARCH_INDEX_NAME,
        compound: {
          must: [
            {
              autocomplete: {
                query: searchQuery,
                path: 'fullName',
                fuzzy: {},
              },
            },
            {
              text: {
                query: country,
                path: 'country',
              },
            },
          ],
        },
      },
    })
  } else {
    pipeline.push({
      $search: {
        index: USER_AUTOCOMPLETE_INDEX_NAME,
        autocomplete: {
          query: searchQuery,
          path: 'fullName',
          tokenOrder: 'sequential',
        },
      },
    })
  }

  pipeline.push(buildProjectionStage())
  return pipeline
}

function buildProjectionStage() {
  return {
    $project: {
      _id: 0,
      score: { $meta: 'searchScore' },
      userId: 1,
      fullName: 1,
      email: 1,
      avatar: 1,
      registeredAt: 1,
      country: 1,
    },
  }
} 