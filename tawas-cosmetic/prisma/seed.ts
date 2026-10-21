// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(' Seeding Tawas Cosmetic...');

  // ---------- DELIVERY ZONES ----------
  const zones = await Promise.all([
    prisma.deliveryZone.upsert({
      where: { id: 'zone-nairobi-cbd' },
      update: {},
      create: {
        id: 'zone-nairobi-cbd',
        name: 'Nairobi CBD',
        areas: ['CBD', 'River Road', 'University Way', 'Ngara', 'Uhuru Highway'],
        feeKes: 250,
        estimatedDaysMin: 1,
        estimatedDaysMax: 1,
        freeThresholdKes: 3000,
        sortOrder: 1,
      },
    }),
    prisma.deliveryZone.upsert({
      where: { id: 'zone-nairobi-suburbs' },
      update: {},
      create: {
        id: 'zone-nairobi-suburbs',
        name: 'Nairobi Suburbs',
        areas: ['Westlands', 'Kilimani', 'Karen', 'Runda', 'Lavington', 'Langata', 'Kileleshwa', 'Parklands'],
        feeKes: 350,
        estimatedDaysMin: 1,
        estimatedDaysMax: 2,
        freeThresholdKes: 5000,
        sortOrder: 2,
      },
    }),
    prisma.deliveryZone.upsert({
      where: { id: 'zone-major-towns' },
      update: {},
      create: {
        id: 'zone-major-towns',
        name: 'Major Towns',
        areas: ['Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Nyeri', 'Machakos'],
        feeKes: 500,
        estimatedDaysMin: 2,
        estimatedDaysMax: 3,
        freeThresholdKes: null,
        sortOrder: 3,
      },
    }),
    prisma.deliveryZone.upsert({
      where: { id: 'zone-upcountry' },
      update: {},
      create: {
        id: 'zone-upcountry',
        name: 'Upcountry',
        areas: [], // any town not listed above falls here via admin assignment
        feeKes: 650,
        estimatedDaysMin: 3,
        estimatedDaysMax: 5,
        freeThresholdKes: null,
        sortOrder: 4,
      },
    }),
  ]);
  console.log(` ${zones.length} delivery zones`);

  // ---------- CATEGORIES ----------
  const makeup = await prisma.category.upsert({
    where: { slug: 'makeup' },
    update: {},
    create: {
      slug: 'makeup',
      name: 'Makeup',
      description: 'Lipsticks, glosses, foundations and more to define your glow.',
      sortOrder: 1,
    },
  });

  const skincare = await prisma.category.upsert({
    where: { slug: 'skincare' },
    update: {},
    create: {
      slug: 'skincare',
      name: 'Skincare',
      description: 'Cleansers, serums and moisturisers that care for your natural glow.',
      sortOrder: 2,
    },
  });

  console.log(' Categories: makeup, skincare');

  // ---------- PRODUCTS (8 sample products, 2–3 variants each) ----------
  const products = [
    {
      slug: 'velvet-matte-lipstick',
      name: 'Velvet Matte Lipstick',
      description: 'A long-wearing matte lipstick that glides on smoothly and stays put for up to 8 hours.',
      benefits: 'Weightless finish · 8-hour wear · Enriched with shea butter',
      categoryId: makeup.id,
      basePriceKes: 1450,
      images: ['/images/products/velvet-lipstick-1.jpg', '/images/products/velvet-lipstick-2.jpg'],
      isFeatured: true,
      isNew: false,
      variants: [
        { sku: 'TW-LIP-VEL-RUBY', name: 'Ruby Red', shadeHex: '#9B1B30', priceKes: 1450, stock: 24 },
        { sku: 'TW-LIP-VEL-ROSE', name: 'Dusty Rose', shadeHex: '#C4818A', priceKes: 1450, stock: 18 },
        { sku: 'TW-LIP-VEL-BERRY', name: 'Berry Bold', shadeHex: '#7A2E4A', priceKes: 1450, stock: 12 },
      ],
    },
    {
      slug: 'glow-shine-lip-gloss',
      name: 'Glow Shine Lip Gloss',
      description: 'High-shine gloss with a non-sticky formula. Perfect for everyday luminosity.',
      benefits: 'Non-sticky · Vitamin E · Subtle tint',
      categoryId: makeup.id,
      basePriceKes: 950,
      images: ['/images/products/gloss-1.jpg', '/images/products/gloss-2.jpg'],
      isFeatured: true,
      isNew: true,
      variants: [
        { sku: 'TW-LIP-GLS-CLEAR', name: 'Clear Shine', shadeHex: '#F5E9E0', priceKes: 950, stock: 30 },
        { sku: 'TW-LIP-GLS-PINK', name: 'Soft Pink', shadeHex: '#E8B4C0', priceKes: 950, stock: 22 },
        { sku: 'TW-LIP-GLS-BERRY', name: 'Berry Kiss', shadeHex: '#A84766', priceKes: 950, stock: 15 },
      ],
    },
    {
      slug: 'luminous-foundation',
      name: 'Luminous Foundation',
      description: 'Medium-to-full coverage foundation with a natural, luminous finish.',
      benefits: 'Buildable coverage · SPF 15 · 12-hour wear',
      categoryId: makeup.id,
      basePriceKes: 2200,
      images: ['/images/products/foundation-1.jpg'],
      isFeatured: false,
      isNew: false,
      variants: [
        { sku: 'TW-FND-LUM-330', name: 'Shade 330 · Warm Medium', shadeHex: '#B57A56', priceKes: 2200, stock: 10 },
        { sku: 'TW-FND-LUM-420', name: 'Shade 420 · Deep Warm', shadeHex: '#7A4A2E', priceKes: 2200, stock: 8 },
        { sku: 'TW-FND-LUM-510', name: 'Shade 510 · Rich Deep', shadeHex: '#4E2E1C', priceKes: 2200, stock: 6 },
      ],
    },
    {
      slug: 'brow-defining-pencil',
      name: 'Brow Defining Pencil',
      description: 'Ultra-fine tip brow pencil for precise, natural-looking definition.',
      benefits: 'Fine tip · Spoolie included · Waterproof',
      categoryId: makeup.id,
      basePriceKes: 800,
      images: ['/images/products/brow-pencil.jpg'],
      isFeatured: false,
      isNew: true,
      variants: [
        { sku: 'TW-BRW-PNC-SOFT', name: 'Soft Brown', shadeHex: '#6B4A3A', priceKes: 800, stock: 20 },
        { sku: 'TW-BRW-PNC-DARK', name: 'Dark Brown', shadeHex: '#3D2419', priceKes: 800, stock: 18 },
      ],
    },
    {
      slug: 'radiance-face-serum',
      name: 'Radiance Face Serum',
      description: 'A lightweight vitamin C serum that brightens and evens skin tone.',
      benefits: '15% Vitamin C · Hyaluronic acid · Fragrance-free',
      categoryId: skincare.id,
      basePriceKes: 2800,
      images: ['/images/products/serum-1.jpg'],
      isFeatured: true,
      isNew: false,
      variants: [
        { sku: 'TW-SRM-RAD-30', name: '30ml', priceKes: 2800, stock: 15 },
        { sku: 'TW-SRM-RAD-50', name: '50ml', priceKes: 4200, stock: 9 },
      ],
    },
    {
      slug: 'gentle-cleansing-gel',
      name: 'Gentle Cleansing Gel',
      description: 'A soap-free daily cleanser that removes makeup without stripping skin.',
      benefits: 'Soap-free · pH balanced · Suitable for sensitive skin',
      categoryId: skincare.id,
      basePriceKes: 1600,
      images: ['/images/products/cleanser.jpg'],
      isFeatured: false,
      isNew: false,
      variants: [
        { sku: 'TW-CLN-GEL-150', name: '150ml', priceKes: 1600, stock: 25 },
      ],
    },
    {
      slug: 'hydrating-moisturiser',
      name: 'Hydrating Moisturiser',
      description: 'Rich but fast-absorbing moisturiser for daily hydration.',
      benefits: 'Ceramides · Shea butter · Non-comedogenic',
      categoryId: skincare.id,
      basePriceKes: 1900,
      images: ['/images/products/moisturiser.jpg'],
      isFeatured: false,
      isNew: false,
      variants: [
        { sku: 'TW-MST-HYD-50', name: '50ml', priceKes: 1900, stock: 20 },
        { sku: 'TW-MST-HYD-100', name: '100ml', priceKes: 3100, stock: 12 },
      ],
    },
    {
      slug: 'overnight-repair-mask',
      name: 'Overnight Repair Mask',
      description: 'A leave-on sleeping mask that restores skin overnight.',
      benefits: 'Retinol · Peptides · Wake up glowing',
      categoryId: skincare.id,
      basePriceKes: 2400,
      images: ['/images/products/mask.jpg'],
      isFeatured: false,
      isNew: true,
      variants: [
        { sku: 'TW-MSK-REP-50', name: '50ml', priceKes: 2400, stock: 10 },
      ],
    },
  ];

  for (const p of products) {
    const { variants, ...productData } = p;
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        variants: {
          create: variants,
        },
      },
    });
  }

  console.log(` ${products.length} products with variants`);

  // ---------- ADMIN USER ----------
  // Default admin — change password immediately after first login
  const bcrypt = await import('bcryptjs');
  const passwordHash = await bcrypt.hash('ChangeMe123!', 10);

  await prisma.adminUser.upsert({
    where: { email: 'admin@tawascosmetic.co.ke' },
    update: {},
    create: {
      email: 'admin@tawascosmetic.co.ke',
      passwordHash,
      name: 'Tawas Admin',
      role: 'OWNER',
    },
  });

  console.log(' Admin user: admin@tawascosmetic.co.ke / ChangeMe123!');
  console.log('  Change this password immediately after first login.');
  console.log(' Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });