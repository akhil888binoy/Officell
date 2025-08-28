import {prisma} from "../src/index";
import {Prisma} from '../src/generated/prisma'

const userData: Prisma.UserCreateInput[] = [
  {
    linkedin_id: 'lnkd_001',
    username: 'akhil',
    email: 'akhil@example.com',
    avatar_url: 'https://i.pravatar.cc/150?img=1',
    verification_status: 'VERIFIED',
    role: 'USER',
    vents: {
      create: [
        {
          no_pii: true,
          verified_employee: true,
          content: 'Great culture and good work-life balance.',
          category: 'Culture',
          upvote: 5,
          downvote: 1,
          company: {
            create: {
              google_place_id: 'gpid_001',
              name: 'TechCorp',
              domain: 'techcorp.com',
              industry: 'Software',
              city: 'Bangalore',
              state: 'Karnataka',
              country: 'India',
              formatted_address: '123 Main Street, Bangalore',
              lat: new Prisma.Decimal(12.9716),
              lng: new Prisma.Decimal(77.5946),
            },
          },
          comments: {
            create: [
              {
                comment: 'Totally agree! Best company I’ve worked at.',
                author: {
                  create: {
                    linkedin_id: 'lnkd_002',
                    username: 'sarah',
                    email: 'sarah@example.com',
                    avatar_url: 'https://i.pravatar.cc/150?img=2',
                  },
                },
              },
            ],
          },
          Media: {
            create: {
              type: 'IMAGE',
              url: 'https://picsum.photos/200/300',
            },
          },
        },
      ],
    },
  },
  {
    linkedin_id: 'lnkd_003',
    username: 'mahesh',
    email: 'mahesh@example.com',
    avatar_url: 'https://i.pravatar.cc/150?img=3',
    verification_status: 'UNVERIFIED',
    role: 'USER',
    vents: {
      create: [
        {
          no_pii: true,
          verified_employee: false,
          content: 'Workload is very high, but pay is decent.',
          category: 'Workload',
          upvote: 2,
          downvote: 3,
          company: {
            create: {
              google_place_id: 'gpid_002',
              name: 'FinEdge',
              domain: 'finedge.com',
              industry: 'Finance',
              city: 'New York',
              state: 'NY',
              country: 'USA',
              formatted_address: '456 Wall Street, New York',
              lat: new Prisma.Decimal(40.7128),
              lng: new Prisma.Decimal(-74.006),
            },
          },
          Media: {
            create: {
              type: 'VIDEO',
              url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny.mp4',
            },
          },
          reports: {
            create: [
              {
                reporter: {
                  create: {
                    linkedin_id: 'lnkd_004',
                    username: 'admin',
                    email: 'admin@example.com',
                    avatar_url: 'https://i.pravatar.cc/150?img=4',
                    role: 'ADMIN',
                    verification_status: 'VERIFIED',
                  },
                },
                report: 'Contains misleading info',
                category: 'Misinformation',
                status: 'PENDING'
              },
            ],
          },
        },
      ],
    },
  },
]

async function main() {
  console.log(`🌱 Start seeding ...`)

  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`✅ Created user with id: ${user.id}`)
  }

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
