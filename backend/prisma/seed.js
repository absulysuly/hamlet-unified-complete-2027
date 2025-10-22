const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const SEED_SOURCE = path.join(__dirname, '..', 'data', 'candidates.json');

function normalizeCandidate(candidate, index) {
  if (!candidate || typeof candidate !== 'object') return null;

  const uniqueCandidateId =
    candidate.uniqueCandidateId ||
    candidate.candidateId ||
    candidate.id ||
    null;

  if (!uniqueCandidateId) return null;

  const ballotNumber =
    candidate.ballotNumber ||
    candidate.ballot_number ||
    candidate.ballotNo ||
    `AUTO-${index + 1}`;

  const referralCode =
    candidate.referralCode ||
    candidate.referral ||
    `REF-${uniqueCandidateId}`;

  const partyNameArabic =
    candidate.partyNameArabic ||
    candidate.party_name_ar ||
    'Independent';

  const nominationType =
    candidate.nominationType ||
    candidate.nomination_type ||
    'GENERAL';

  const governorate =
    candidate.governorate ||
    candidate.province ||
    'UNKNOWN';

  const sex = String(candidate.sex || candidate.gender || 'UNKNOWN').toUpperCase();

  const fullNameArabic =
    candidate.fullNameArabic ||
    candidate.nameArabic ||
    candidate.name ||
    `Candidate ${index + 1}`;

  if (!ballotNumber || !referralCode || !partyNameArabic || !nominationType || !governorate || !sex || !fullNameArabic) {
    return null;
  }

  const record = {
    uniqueCandidateId: String(uniqueCandidateId),
    ballotNumber: String(ballotNumber),
    partyNameArabic: String(partyNameArabic),
    nominationType: String(nominationType),
    governorate: String(governorate),
    sex,
    fullNameArabic: String(fullNameArabic),
    referralCode: String(referralCode)
  };

  if (candidate.voterNumber != null) {
    const num = Number(candidate.voterNumber);
    if (Number.isFinite(num)) record.voterNumber = num;
  }

  if (candidate.candidateSequence != null) {
    const num = Number(candidate.candidateSequence);
    if (Number.isFinite(num)) record.candidateSequence = num;
  }

  if (candidate.fullNameEnglish || candidate.nameEnglish) {
    record.fullNameEnglish = String(candidate.fullNameEnglish || candidate.nameEnglish);
  }
  if (candidate.partyNameEnglish || candidate.party_name_en) {
    record.partyNameEnglish = String(candidate.partyNameEnglish || candidate.party_name_en);
  }
  if (candidate.email) record.email = String(candidate.email);
  if (candidate.phone) record.phone = String(candidate.phone);
  if (candidate.bio) record.bio = String(candidate.bio);
  if (candidate.photoUrl || candidate.photo_url) {
    record.photoUrl = String(candidate.photoUrl || candidate.photo_url);
  }
  if (candidate.coverPhotoUrl || candidate.cover_photo_url) {
    record.coverPhotoUrl = String(candidate.coverPhotoUrl || candidate.cover_photo_url);
  }

  return record;
}

async function seedCandidates() {
  if (!fs.existsSync(SEED_SOURCE)) {
    console.log('Seed data file not found. Skipping candidate seeding.');
    return;
  }

  const raw = fs.readFileSync(SEED_SOURCE, 'utf8').trim();
  if (!raw) {
    console.log('Seed data file is empty. Skipping candidate seeding.');
    return;
  }

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (error) {
    console.error('Failed to parse seed data. Skipping candidate seeding.', error);
    return;
  }

  if (!Array.isArray(payload) || payload.length === 0) {
    console.log('Seed payload contains no candidates. Skipping candidate seeding.');
    return;
  }

  const candidates = payload
    .map(normalizeCandidate)
    .filter(Boolean);

  if (candidates.length === 0) {
    console.log('No valid candidate records were derived from seed data. Skipping candidate seeding.');
    return;
  }

  const chunkSize = 500;
  for (let i = 0; i < candidates.length; i += chunkSize) {
    const chunk = candidates.slice(i, i + chunkSize);
    await prisma.candidate.createMany({
      data: chunk,
      skipDuplicates: true
    });
  }

  console.log(`Seeded ${candidates.length} candidate records (duplicates skipped).`);
}

async function main() {
  await seedCandidates();
}

main()
  .catch((error) => {
    console.error('Prisma seed failed.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
