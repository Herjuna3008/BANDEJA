import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@bandeja.id";

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: {
      email: adminEmail,
      name: "BANDEJA Admin",
      role: "ADMIN",
    },
  });
  console.log("✓ Admin user:", admin.email);

  // Venue owners
  const owner1 = await prisma.user.upsert({
    where: { email: "owner.south@bandeja.id" },
    update: {},
    create: {
      email: "owner.south@bandeja.id",
      name: "Ahmad Venue",
      role: "VENUE_OWNER",
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: "owner.north@bandeja.id" },
    update: {},
    create: {
      email: "owner.north@bandeja.id",
      name: "Budi Padel",
      role: "VENUE_OWNER",
    },
  });

  const owner3 = await prisma.user.upsert({
    where: { email: "owner.west@bandeja.id" },
    update: {},
    create: {
      email: "owner.west@bandeja.id",
      name: "Citra Arena",
      role: "VENUE_OWNER",
    },
  });

  // Venues
  const venueSouth = await prisma.venue.upsert({
    where: { code: "VENUE-SOUTH" },
    update: {},
    create: {
      name: "URBAN PADEL GADING SERPONG",
      code: "VENUE-SOUTH",
      shortName: "South",
      area: "Tangerang",
      district: "Gading Serpong",
      tone: "lime",
      status: "APPROVED",
      ownerId: owner1.id,
    },
  });

  const venueNorth = await prisma.venue.upsert({
    where: { code: "VENUE-BSD" },
    update: {},
    create: {
      name: "RED WOOD PADEL BSD",
      code: "VENUE-BSD",
      shortName: "RED WOOD",
      area: "Tangerang Selatan",
      district: "BSD City",
      tone: "orange",
      status: "APPROVED",
      ownerId: owner2.id,
    },
  });

  const venueWest = await prisma.venue.upsert({
    where: { code: "VENUE-ALAM-SUTERA" },
    update: {},
    create: {
      name: "GANCHO ARENA",
      code: "VENUE-ALAM-SUTERA",
      shortName: "GANCHO ARENA",
      area: "Tangerang Selatan",
      district: "Alam Sutera",
      tone: "teal",
      status: "APPROVED",
      ownerId: owner3.id,
    },
  });

  console.log("✓ Venues created");

  // Courts for South venue
  const courtsSouth = [
    { name: "Court A1", surface: "INDOOR" as const, pricePerHour: 120000 },
    { name: "Court A2", surface: "INDOOR" as const, pricePerHour: 120000 },
    { name: "Court A3", surface: "OUTDOOR" as const, pricePerHour: 100000 },
    { name: "Court A4", surface: "OUTDOOR" as const, pricePerHour: 100000 },
  ];
  for (const c of courtsSouth) {
    await prisma.court.upsert({
      where: {
        id: `south-${c.name.replace(" ", "-").toLowerCase()}`,
      },
      update: {},
      create: {
        id: `south-${c.name.replace(" ", "-").toLowerCase()}`,
        ...c,
        venueId: venueSouth.id,
      },
    });
  }

  // Courts for North venue
  const courtsNorth = [
    { name: "Court B1", surface: "INDOOR" as const, pricePerHour: 100000 },
    { name: "Court B2", surface: "INDOOR" as const, pricePerHour: 100000 },
    { name: "Court B3", surface: "INDOOR" as const, pricePerHour: 100000 },
    { name: "Court B4", surface: "OUTDOOR" as const, pricePerHour: 90000 },
  ];
  for (const c of courtsNorth) {
    await prisma.court.upsert({
      where: {
        id: `north-${c.name.replace(" ", "-").toLowerCase()}`,
      },
      update: {},
      create: {
        id: `north-${c.name.replace(" ", "-").toLowerCase()}`,
        ...c,
        venueId: venueNorth.id,
      },
    });
  }

  // Courts for West venue
  const courtsWest = [
    { name: "Court C1", surface: "INDOOR" as const, pricePerHour: 90000 },
    { name: "Court C2", surface: "INDOOR" as const, pricePerHour: 90000 },
    { name: "Court C3", surface: "INDOOR" as const, pricePerHour: 90000 },
    { name: "Court C4", surface: "OUTDOOR" as const, pricePerHour: 80000 },
  ];
  for (const c of courtsWest) {
    await prisma.court.upsert({
      where: {
        id: `west-${c.name.replace(" ", "-").toLowerCase()}`,
      },
      update: {},
      create: {
        id: `west-${c.name.replace(" ", "-").toLowerCase()}`,
        ...c,
        venueId: venueWest.id,
      },
    });
  }

  console.log("✓ Courts created");

  // Coach users
  const coachUser1 = await prisma.user.upsert({
    where: { email: "rafa.santana@bandeja.id" },
    update: {},
    create: {
      email: "rafa.santana@bandeja.id",
      name: "Rafa Santana",
      role: "COACH",
    },
  });

  const coachUser2 = await prisma.user.upsert({
    where: { email: "lisa.chen@bandeja.id" },
    update: {},
    create: {
      email: "lisa.chen@bandeja.id",
      name: "Lisa Chen",
      role: "COACH",
    },
  });

  const coachUser3 = await prisma.user.upsert({
    where: { email: "andre.putra@bandeja.id" },
    update: {},
    create: {
      email: "andre.putra@bandeja.id",
      name: "Andre Putra",
      role: "COACH",
    },
  });

  // Coach records
  const coach1 = await prisma.coach.upsert({
    where: { userId: coachUser1.id },
    update: {},
    create: {
      userId: coachUser1.id,
      specialty: "Teknik & Rally",
      experience: "8 Tahun Exp",
      ratePerSession: 200000,
      bio: "Spesialis teknik dasar dan rally. Cocok untuk pemula hingga intermediate.",
      status: "APPROVED",
    },
  });

  const coach2 = await prisma.coach.upsert({
    where: { userId: coachUser2.id },
    update: {},
    create: {
      userId: coachUser2.id,
      specialty: "Footwork & Defense",
      experience: "6 Tahun Exp",
      ratePerSession: 180000,
      bio: "Ahli footwork dan defensive play. Mantan atlet nasional.",
      status: "APPROVED",
    },
  });

  const coach3 = await prisma.coach.upsert({
    where: { userId: coachUser3.id },
    update: {},
    create: {
      userId: coachUser3.id,
      specialty: "Strategi & Doubles",
      experience: "10 Tahun Exp",
      ratePerSession: 220000,
      bio: "Spesialis strategi doubles. Mentor tim padel profesional.",
      status: "APPROVED",
    },
  });

  console.log("✓ Coaches created");

  // Coach-Venue associations
  await prisma.coachVenue.upsert({
    where: { coachId_venueId: { coachId: coach1.id, venueId: venueSouth.id } },
    update: {},
    create: { coachId: coach1.id, venueId: venueSouth.id },
  });
  await prisma.coachVenue.upsert({
    where: { coachId_venueId: { coachId: coach1.id, venueId: venueNorth.id } },
    update: {},
    create: { coachId: coach1.id, venueId: venueNorth.id },
  });
  await prisma.coachVenue.upsert({
    where: { coachId_venueId: { coachId: coach2.id, venueId: venueWest.id } },
    update: {},
    create: { coachId: coach2.id, venueId: venueWest.id },
  });
  await prisma.coachVenue.upsert({
    where: { coachId_venueId: { coachId: coach3.id, venueId: venueSouth.id } },
    update: {},
    create: { coachId: coach3.id, venueId: venueSouth.id },
  });

  console.log("✓ Coach-Venue associations created");
  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
