import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.emailLog.deleteMany();
  await prisma.collaborationRequest.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.socialProfile.deleteMany();
  await prisma.admin.deleteMany();

  // 1. Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@influencer.com',
      hashedPassword,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // 2. Create social profiles
  const socialProfiles = await Promise.all([
    prisma.socialProfile.create({
      data: {
        platformName: 'Instagram',
        handle: '@influencer',
        profileUrl: 'https://instagram.com/influencer',
        followerCount: 500000,
        bioExcerpt: 'Lifestyle & fashion content creator sharing daily inspiration and brand collaborations.',
        sortOrder: 0,
      },
    }),
    prisma.socialProfile.create({
      data: {
        platformName: 'YouTube',
        handle: '@influencer',
        profileUrl: 'https://youtube.com/@influencer',
        followerCount: 250000,
        bioExcerpt: 'Weekly vlogs, tutorials, and behind-the-scenes content from campaigns and events.',
        sortOrder: 1,
      },
    }),
    prisma.socialProfile.create({
      data: {
        platformName: 'Facebook',
        handle: 'Influencer Official',
        profileUrl: 'https://facebook.com/influencerofficial',
        followerCount: 100000,
        bioExcerpt: 'Community updates, live sessions, and exclusive announcements.',
        sortOrder: 2,
      },
    }),
    prisma.socialProfile.create({
      data: {
        platformName: 'Hevy',
        handle: '@influencer_fit',
        profileUrl: 'https://hevy.com/user/influencer_fit',
        followerCount: 50000,
        bioExcerpt: 'Fitness routines, workout logs, and wellness tips for an active lifestyle.',
        sortOrder: 3,
      },
    }),
  ]);
  console.log(`✅ ${socialProfiles.length} social profiles created`);


  // 3. Create portfolio items
  const portfolioItems = await Promise.all([
    prisma.portfolioItem.create({
      data: {
        title: 'Summer Fashion Campaign with Luxe Brand',
        mediaUrl: '/portfolio/summer-fashion.jpg',
        mediaType: 'IMAGE',
        brand: 'Luxe Brand',
        category: 'Fashion',
        active: true,
        sortOrder: 0,
      },
    }),
    prisma.portfolioItem.create({
      data: {
        title: 'Fitness Product Review - Premium Supplements',
        mediaUrl: '/portfolio/fitness-review.mp4',
        mediaType: 'VIDEO',
        brand: 'FitLife Pro',
        category: 'Fitness',
        active: true,
        sortOrder: 1,
      },
    }),
    prisma.portfolioItem.create({
      data: {
        title: 'Travel Vlog Series - Maldives Resort Partnership',
        mediaUrl: '/portfolio/maldives-travel.mp4',
        mediaType: 'VIDEO',
        brand: 'Paradise Resorts',
        category: 'Travel',
        active: true,
        sortOrder: 2,
      },
    }),
    prisma.portfolioItem.create({
      data: {
        title: 'Skincare Routine Collaboration',
        mediaUrl: '/portfolio/skincare-collab.jpg',
        mediaType: 'IMAGE',
        brand: 'GlowUp Cosmetics',
        category: 'Beauty',
        active: true,
        sortOrder: 3,
      },
    }),
    prisma.portfolioItem.create({
      data: {
        title: 'Tech Unboxing - Limited Edition Headphones',
        mediaUrl: '/portfolio/tech-unboxing.jpg',
        mediaType: 'IMAGE',
        brand: 'SoundWave Audio',
        category: 'Technology',
        active: false,
        sortOrder: 4,
      },
    }),
  ]);
  console.log(`✅ ${portfolioItems.length} portfolio items created`);

  // 4. Create collaboration requests with mixed statuses
  const collaborationRequests = await Promise.all([
    prisma.collaborationRequest.create({
      data: {
        brandName: 'Nike',
        contactName: 'Sarah Johnson',
        contactEmail: 'sarah@nike.com',
        collaborationType: 'SPONSORED_POST',
        budgetRange: 'RANGE_5000_10000',
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-03-01'),
        description: 'Looking for a sponsored post featuring our new running shoe line for spring collection launch.',
        status: 'PENDING',
      },
    }),
    prisma.collaborationRequest.create({
      data: {
        brandName: 'Sephora',
        contactName: 'Emily Chen',
        contactEmail: 'emily.chen@sephora.com',
        collaborationType: 'PRODUCT_REVIEW',
        budgetRange: 'RANGE_1000_5000',
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-02-15'),
        description: 'We would love a detailed review of our new skincare line targeting young professionals.',
        status: 'ACCEPTED',
      },
    }),
    prisma.collaborationRequest.create({
      data: {
        brandName: 'FitBit',
        contactName: 'Mark Thompson',
        contactEmail: 'mark.t@fitbit.com',
        collaborationType: 'BRAND_AMBASSADOR',
        budgetRange: 'OVER_10000',
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-06-01'),
        description: 'Long-term brand ambassador partnership for our new fitness tracker series.',
        status: 'PENDING',
      },
    }),
    prisma.collaborationRequest.create({
      data: {
        brandName: 'Local Coffee Shop',
        contactName: 'James Wilson',
        contactEmail: 'james@localcoffee.com',
        collaborationType: 'GIVEAWAY',
        budgetRange: 'UNDER_500',
        startDate: new Date('2025-01-10'),
        endDate: new Date('2025-01-20'),
        description: 'Small giveaway collaboration for our new seasonal blend launch.',
        status: 'REJECTED',
      },
    }),
    prisma.collaborationRequest.create({
      data: {
        brandName: 'Adidas',
        contactName: 'Lisa Park',
        contactEmail: 'lisa.park@adidas.com',
        collaborationType: 'EVENT_APPEARANCE',
        budgetRange: 'RANGE_5000_10000',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-03'),
        description: 'Appearance at our flagship store opening event in downtown LA.',
        status: 'COMPLETED',
      },
    }),
    prisma.collaborationRequest.create({
      data: {
        brandName: 'Samsung',
        contactName: 'David Kim',
        contactEmail: 'david.kim@samsung.com',
        collaborationType: 'SPONSORED_POST',
        budgetRange: 'RANGE_5000_10000',
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-04-30'),
        description: 'Sponsored content for our new Galaxy phone launch campaign across social platforms.',
        status: 'PENDING',
      },
    }),
    prisma.collaborationRequest.create({
      data: {
        brandName: 'Gymshark',
        contactName: 'Rachel Green',
        contactEmail: 'rachel@gymshark.com',
        collaborationType: 'BRAND_AMBASSADOR',
        budgetRange: 'RANGE_1000_5000',
        startDate: new Date('2024-11-01'),
        endDate: new Date('2025-01-31'),
        description: 'Three-month ambassador deal featuring our winter activewear collection.',
        status: 'COMPLETED',
      },
    }),
    prisma.collaborationRequest.create({
      data: {
        brandName: 'Airbnb',
        contactName: 'Tom Harris',
        contactEmail: 'tom.harris@airbnb.com',
        collaborationType: 'OTHER',
        budgetRange: 'RANGE_500_1000',
        startDate: new Date('2025-02-14'),
        endDate: new Date('2025-02-21'),
        description: 'Travel content creation featuring unique stays for Valentine\'s Day campaign.',
        status: 'ACCEPTED',
      },
    }),
  ]);
  console.log(`✅ ${collaborationRequests.length} collaboration requests created`);

  console.log('🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
