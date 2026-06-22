// Seed — RBAC + référentiels + données de démonstration.
// Exécution : npm run prisma:seed (nécessite DATABASE_URL + base migrée).
import { PrismaClient } from "@prisma/client";
import {
  ROLES,
  ROLE_LABELS,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  type RoleKey,
} from "../src/lib/rbac";
import {
  centers,
  events,
  products,
  resources,
  childrenProgram,
  metricsDemo,
  membershipRequestsDemo,
} from "../src/data/demo";
import { partners } from "../src/data/impact";

const prisma = new PrismaClient();

// Utilisateurs de démo (hash scrypt) — alignés sur src/lib/auth/users.ts.
const seedUsers: { email: string; fullName: string; passwordHash: string; roleKeys: RoleKey[] }[] = [
  { email: "super@diabaction.cg", fullName: "Super Administrateur", roleKeys: [ROLES.SUPER_ADMIN], passwordHash: "983e0834d65e9f0b9208e5f3f223bb00:3b547eeaeaf46e0ffcb476e8b518e7cfb3c7fcaea2c0cbe31c9f50fce8d50e4f4923e9df75f40334f0c4eb5330179063c380222d2983d87c34905237d9ac720f" },
  { email: "admin@diabaction.cg", fullName: "Administrateur", roleKeys: [ROLES.ADMIN], passwordHash: "6367a0959b4c85185f65129a1304dc72:1b93dd695b86c2d46637f896c7ae87dbbbdf706cb780325b34e56bc0730dc5776321cf6a4585ca7ae889ccc6087c1e6e4feb610bf26dfd8c38a4bb903238de1b" },
  { email: "membre@diabaction.cg", fullName: "Membre Démo", roleKeys: [ROLES.MEMBER], passwordHash: "40ee2b10a47255c2d4e09cb048b9f8c2:8411b33ede295f2259fcbf73640ba8be32ca8db78fcaeb82b226845a61a88db9850b209f5725f5a73e4d9b3aed5da44abcf4c358ca41f18ef55d2a06a6263fa1" },
  { email: "pro@diabaction.cg", fullName: "Professionnel de santé", roleKeys: [ROLES.HEALTH_PROFESSIONAL], passwordHash: "32a5968859370503cafc4fcf53b14065:370eac371750be54ec11bfe60268cdb025d32625ed4ab0adc9949336125dccf0e9241aacd1b3eb7c3c6a747fefb14fa83ad88b43de3815eefbd32c0a07bc9e53" },
  { email: "partenaire@diabaction.cg", fullName: "Partenaire Institutionnel", roleKeys: [ROLES.PARTNER], passwordHash: "3f44022745fd59b07797ed77067cd9ba:253c353ff6ca42c4cb8df08b96494ba9bb68e319383712f056a3d9c4716672bbf20339334edbe9224f6815a1b03974492f717f2d55d8e0047e68fddff7f4292a" },
];

async function seedRbac() {
  for (const key of Object.values(PERMISSIONS)) {
    await prisma.permission.upsert({ where: { key }, update: {}, create: { key, description: key } });
  }
  for (const roleKey of Object.values(ROLES) as RoleKey[]) {
    const role = await prisma.role.upsert({
      where: { key: roleKey },
      update: { name: ROLE_LABELS[roleKey] },
      create: { key: roleKey, name: ROLE_LABELS[roleKey], isSystem: true },
    });
    for (const permKey of ROLE_PERMISSIONS[roleKey]) {
      const perm = await prisma.permission.findUniqueOrThrow({ where: { key: permKey } });
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
        update: {},
        create: { roleId: role.id, permissionId: perm.id },
      });
    }
  }
  console.log(`✓ RBAC: ${Object.values(PERMISSIONS).length} permissions, ${Object.keys(ROLES).length} rôles`);
}

async function seedUsersAndRoles() {
  for (const u of seedUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { fullName: u.fullName, passwordHash: u.passwordHash },
      create: { email: u.email, fullName: u.fullName, passwordHash: u.passwordHash },
    });
    for (const rk of u.roleKeys) {
      const role = await prisma.role.findUniqueOrThrow({ where: { key: rk } });
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId: role.id } },
        update: {},
        create: { userId: user.id, roleId: role.id },
      });
    }
  }
  console.log(`✓ Utilisateurs: ${seedUsers.length}`);
}

async function seedGeoAndCenters() {
  // Départements + villes (dérivés des centres).
  const deptByName = new Map<string, string>();
  for (const name of new Set(centers.map((c) => c.department))) {
    const d = await prisma.department.upsert({
      where: { code: name }, update: {}, create: { name, code: name },
    });
    deptByName.set(name, d.id);
  }
  const cityByName = new Map<string, string>();
  for (const c of centers) {
    if (cityByName.has(c.city)) continue;
    const existing = await prisma.city.findFirst({ where: { name: c.city } });
    const city = existing ?? (await prisma.city.create({
      data: { name: c.city, departmentId: deptByName.get(c.department)!, lat: c.lat, lng: c.lng },
    }));
    cityByName.set(c.city, city.id);
  }

  // Services (catalogue).
  const serviceByName = new Map<string, string>();
  for (const name of new Set(centers.flatMap((c) => c.services))) {
    const existing = await prisma.service.findFirst({ where: { name } });
    const s = existing ?? (await prisma.service.create({ data: { name } }));
    serviceByName.set(name, s.id);
  }

  // Produits.
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug, name: p.name, category: p.category, description: p.description,
        status: p.status, accessConditions: p.accessConditions, memberBenefit: p.memberBenefit,
      },
    });
  }

  // Centres + liens services/produits.
  for (const c of centers) {
    const center = await prisma.center.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        slug: c.slug, name: c.name, description: c.description, address: c.address,
        cityId: cityByName.get(c.city), lat: c.lat, lng: c.lng, phone: c.phone,
        whatsapp: c.whatsapp, email: c.email, coverageLevel: c.coverageLevel,
        handlesChildren: c.handlesChildren, openingHours: { texte: c.hours },
      },
    });
    for (const sName of c.services) {
      const sId = serviceByName.get(sName)!;
      const existing = await prisma.centerService.findFirst({ where: { centerId: center.id, serviceId: sId } });
      if (!existing) await prisma.centerService.create({ data: { centerId: center.id, serviceId: sId } });
    }
    for (const pSlug of c.products) {
      const product = await prisma.product.findUnique({ where: { slug: pSlug } });
      if (!product) continue;
      const existing = await prisma.centerProduct.findFirst({ where: { centerId: center.id, productId: product.id } });
      if (!existing) await prisma.centerProduct.create({ data: { centerId: center.id, productId: product.id, status: product.status } });
    }
  }
  console.log(`✓ Géo + centres: ${centers.length} centres, ${products.length} produits`);
}

async function seedEvents() {
  for (const e of events) {
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: {},
      create: {
        slug: e.slug, title: e.title, description: e.description, type: e.type,
        startsAt: new Date(e.startsAt), endsAt: e.endsAt ? new Date(e.endsAt) : null,
        locationLabel: e.locationLabel, organizer: e.organizer, phone: e.phone,
        capacity: e.capacity, status: e.status,
      },
    });
  }
  console.log(`✓ Événements: ${events.length}`);
}

async function seedResources() {
  for (const r of resources) {
    await prisma.educationalResource.upsert({
      where: { slug: r.slug },
      update: {},
      create: {
        slug: r.slug, title: r.title, category: r.category, format: r.format,
        summary: r.summary, availableOffline: r.availableOffline, publishedAt: new Date(),
      },
    });
  }
  console.log(`✓ Ressources: ${resources.length}`);
}

async function seedProgram() {
  const program = await prisma.childrenProgram.upsert({
    where: { slug: "programme-enfants" },
    update: {},
    create: {
      slug: "programme-enfants", title: childrenProgram.title,
      presentation: childrenProgram.presentation, notice: childrenProgram.notice,
      eligibilityCriteria: childrenProgram.eligibilityCriteria.join("\n"),
      includedServices: childrenProgram.includedServices.join("\n"),
      registrationProcedure: childrenProgram.registrationProcedure.join("\n"),
      requiredDocuments: childrenProgram.requiredDocuments,
      faq: childrenProgram.faq,
    },
  });
  for (const slug of childrenProgram.participatingCenters) {
    const center = await prisma.center.findUnique({ where: { slug } });
    if (!center) continue;
    const existing = await prisma.programCenter.findFirst({ where: { programId: program.id, centerId: center.id } });
    if (!existing) await prisma.programCenter.create({ data: { programId: program.id, centerId: center.id } });
  }
  console.log("✓ Programme enfants");
}

async function seedMetricsAndRequests() {
  const periodStart = new Date("2026-01-01");
  const periodEnd = new Date("2026-06-30");
  for (const m of metricsDemo) {
    const existing = await prisma.metric.findFirst({ where: { key: m.key, periodStart, periodEnd, departmentId: null } });
    if (!existing) {
      await prisma.metric.create({ data: { key: m.key, periodStart, periodEnd, value: m.value } });
    }
  }
  for (const r of membershipRequestsDemo) {
    const existing = await prisma.membershipRequest.findFirst({ where: { phone: r.phone, lastName: r.lastName } });
    if (!existing) {
      await prisma.membershipRequest.create({
        data: { lastName: r.lastName, firstName: r.firstName, phone: r.phone, status: r.status, createdAt: new Date(r.createdAt) },
      });
    }
  }
  console.log(`✓ Indicateurs: ${metricsDemo.length}, demandes: ${membershipRequestsDemo.length}`);
}

async function seedPartners() {
  for (const p of partners) {
    const existing = await prisma.partner.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.partner.create({
        data: { name: p.name, type: p.type, sector: p.sector, status: p.status, since: new Date(p.since) },
      });
    }
  }
  console.log(`✓ Partenaires: ${partners.length}`);
}

async function main() {
  await seedRbac();
  await seedUsersAndRoles();
  await seedGeoAndCenters();
  await seedEvents();
  await seedResources();
  await seedProgram();
  await seedMetricsAndRequests();
  await seedPartners();
  console.log("✓ Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
