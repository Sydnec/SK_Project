import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const rooms = await prisma.room.findMany({ include: { users: true, rounds: true } })
    res.status(200).json(rooms)
  } else if (req.method === 'POST') {
    const { userName } = req.body

    // Générer un ID aléatoire de 6 caractères (A-Z, 0-9)
    function generateRoomId() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'
      let result = ''
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }

    const id = generateRoomId()
    const room = await prisma.room.create({
      data: {
        id,
        name: `Room de ${userName}`,
        users: {
          connect: { name: userName }
        }
      },
      include: { users: true }
    })
    res.status(201).json(room)
  } else {
    res.status(405).end()
  }
}