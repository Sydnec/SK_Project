import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const room = await prisma.room.findUnique({
      where: { id },
      include: { users: true },
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.status(200).json(room);
  } else if (req.method === 'PUT') {
    const { name } = req.body;
    const room = await prisma.room.update({ where: { id }, data: { name } });
    res.status(200).json(room);
  } else if (req.method === 'DELETE') {
    await prisma.room.delete({ where: { id } });
    res.status(204).end();
  } else {
    res.status(405).end();
  }
}