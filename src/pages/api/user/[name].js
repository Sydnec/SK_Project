import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { name } = req.query

  if (req.method === 'GET') {
    const user = await prisma.user.findUnique({ where: { name }, include: { hands: true, bets: true, CardAssociation: true, Trick: true, room: true } })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.status(200).json(user)
  } else if (req.method === 'PUT') {
    const { roomId } = req.body
    const user = await prisma.user.update({ where: { name }, data: { roomId } })
    res.status(200).json(user)
  } else if (req.method === 'DELETE') {
    await prisma.user.delete({ where: { name } })
    res.status(204).end()
  } else {
    res.status(405).end()
  }
}