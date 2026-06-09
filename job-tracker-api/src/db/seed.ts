import { db } from './connection.ts'
import { users, jobs, status } from './schema.ts'

const seed = async () => {
  console.log('🌱 starting database ...')

  try {
    console.log('clearing existing data ...')
    await db.delete(users)
    await db.delete(jobs)
    await db.delete(status)

    console.log('creating demo users ...')
    const [demoUser] = await db
      .insert(users)
      .values({
        email: 'test@gmai.com',
        firstName: 'testo',
        lastName: '',
        password: '11331',
      })
      .returning()

    console.log('creating demo status ...')
    const [statusResult] = await db
      .insert(status)
      .values({
        statusName: 'Pending',
      })
      .returning()

    console.log('creating demo jobs ...')

    await db.insert(jobs).values({
      companyName: 'Valvo',
      jobTitle: 'Software Engineer',
      userId: demoUser.id,
      status: statusResult.id,
    })

    console.log('✅ Db seeded successfully ...')
  } catch (e) {
    console.error('❌ seed failed', e)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

export default seed
