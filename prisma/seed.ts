import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Menjalankan Seeding Data Users ke Supabase...");

  const sampleUsers = [
    {
      username: "dr_hendra",
      email: "hendra.pratama@rsmad.co.id",
      password: "passHendra2026",
      tokenGmail: "tok_hendra_9821a",
    },
    {
      username: "dr_ratna",
      email: "ratna.kartika@rsmad.co.id",
      password: "passRatna2026",
      tokenGmail: "tok_ratna_4319b",
    },
    {
      username: "siti_perawat",
      email: "siti.rahma@rsmad.co.id",
      password: "passSiti2026",
      tokenGmail: "tok_siti_7712c",
    },
    {
      username: "budi_rawatinap",
      email: "budi.santoso@rsmad.co.id",
      password: "passBudi2026",
      tokenGmail: "tok_budi_5521d",
    },
    {
      username: "dewi_farmasi",
      email: "dewi.lestari@rsmad.co.id",
      password: "passDewi2026",
      tokenGmail: "tok_dewi_8834e",
    },
    {
      username: "ahmad_lab",
      email: "ahmad.fauzi@rsmad.co.id",
      password: "passAhmad2026",
      tokenGmail: "tok_ahmad_6641f",
    },
    {
      username: "rina_adm",
      email: "rina.wulandari@rsmad.co.id",
      password: "passRina2026",
      tokenGmail: "tok_rina_2298g",
    },
    {
      username: "tri_rekammedis",
      email: "tri.wahyuni@rsmad.co.id",
      password: "passTri2026",
      tokenGmail: "tok_tri_1109h",
    },
  ];

  for (const user of sampleUsers) {
    const upserted = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        username: user.username,
        password: user.password,
        tokenGmail: user.tokenGmail,
      },
      create: user,
    });
    console.log(`✓ User tersimpan: ${upserted.username} (${upserted.email})`);
  }

  const count = await prisma.user.count();
  console.log(`🎉 Seeding selesai! Total user saat ini: ${count}`);
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding data users:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
