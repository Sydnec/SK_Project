import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const colors = ['purple', 'yellow', 'black', 'green'];
  // 14 cartes numérotées par couleur
  for (const color of colors) {
    for (let i = 1; i <= 14; i++) {
      await prisma.card.create({
        data: {
          value: i,
          type: color,
        },
      });
    }
  }

  // 5 pirates
  for (let i = 1; i <= 5; i++) {
    await prisma.card.create({
      data: {
        value: i,
        type: 'pirate',
      },
    });
  }

  // 2 sirènes
  for (let i = 1; i <= 2; i++) {
    await prisma.card.create({
      data: {
        value: i,
        type: 'siren',
      },
    });
  }

  // 1 skullking
  await prisma.card.create({
    data: {
      value: 0,
      type: 'skullking',
    },
  });

  // 5 fuites
  for (let i = 1; i <= 5; i++) {
    await prisma.card.create({
      data: {
        value: 0,
        type: 'escape',
      },
    });
  }

  // 1 tigresse
  await prisma.card.create({
    data: {
      value: 0,
      type: 'tigress',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });