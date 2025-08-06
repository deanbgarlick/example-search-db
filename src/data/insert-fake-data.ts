import {config} from 'dotenv'
import {faker} from '@faker-js/faker'

const envFile = process.argv[process.argv.length - 1]
config({path: envFile})

import {mongoClient} from '../mongoClient'
import {User} from '../models/User'
import {dbConfig} from '../config/mongodb'

function createRandomUser() {
  return {
    userId: faker.datatype.uuid(),
    fullName: faker.name.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    registeredAt: faker.date.past(),
    country: faker.address.countryCode(),
  }
}

async function main() {
  try {
    const db = mongoClient.db(dbConfig.MONGODB_DATABASE)
    const collection = db.collection<User>(dbConfig.MONGODB_COLLECTION)

    const users = Array.from({length: 10000}).map((_value, index) => {
      faker.seed(index)
      return createRandomUser()
    })

    await collection.insertMany(users)
  } catch (err) {
    console.log(err)
  } finally {
    await mongoClient.close()
  }
}

main() 