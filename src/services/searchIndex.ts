import { request } from 'urllib'
import { atlasConfig, dbConfig } from '../config/mongodb'
import { USER_SEARCH_INDEX_NAME, USER_AUTOCOMPLETE_INDEX_NAME } from '../models/User'

async function findIndexByName(indexName: string) {
  const allIndexesResponse = await request(
    `${atlasConfig.ATLAS_SEARCH_INDEX_API_URL}/${dbConfig.MONGODB_DATABASE}/${dbConfig.MONGODB_COLLECTION}`,
    {
      dataType: 'json',
      contentType: 'application/json',
      method: 'GET',
      digestAuth: atlasConfig.DIGEST_AUTH,
    }
  )

  return (allIndexesResponse.data as any[]).find((i) => i.name === indexName)
}

async function upsertSearchIndex() {
  const userSearchIndex = await findIndexByName(USER_SEARCH_INDEX_NAME)
  if (!userSearchIndex) {
    await request(atlasConfig.ATLAS_SEARCH_INDEX_API_URL, {
      data: {
        name: USER_SEARCH_INDEX_NAME,
        database: dbConfig.MONGODB_DATABASE,
        collectionName: dbConfig.MONGODB_COLLECTION,
        mappings: {
          dynamic: true,
        },
      },
      dataType: 'json',
      contentType: 'application/json',
      method: 'POST',
      digestAuth: atlasConfig.DIGEST_AUTH,
    })
  }
}

async function upsertAutocompleteIndex() {
  const userAutocompleteIndex = await findIndexByName(USER_AUTOCOMPLETE_INDEX_NAME)
  if (!userAutocompleteIndex) {
    await request(atlasConfig.ATLAS_SEARCH_INDEX_API_URL, {
      data: {
        name: USER_AUTOCOMPLETE_INDEX_NAME,
        database: dbConfig.MONGODB_DATABASE,
        collectionName: dbConfig.MONGODB_COLLECTION,
        mappings: {
          dynamic: false,
          fields: {
            fullName: [
              {
                foldDiacritics: false,
                maxGrams: 7,
                minGrams: 3,
                tokenization: 'edgeGram',
                type: 'autocomplete',
              },
            ],
          },
        },
      },
      dataType: 'json',
      contentType: 'application/json',
      method: 'POST',
      digestAuth: atlasConfig.DIGEST_AUTH,
    })
  }
}

export async function ensureSearchIndexes() {
  await upsertSearchIndex()
  await upsertAutocompleteIndex()
} 