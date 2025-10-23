/**
 * import-candidates.js
 * Usage: node import-candidates.js ../data/master_candidates_bilingual_2025-10-14.csv
 */
import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const file = process.argv[2] || './data/master_candidates_bilingual_2025-10-14.csv';
if (!fs.existsSync(file)) {
  console.error('CSV file not found:', file);
  process.exit(1);
}

(async () => {
  console.log('Reading CSV:', file);
  const rows = [];
  fs.createReadStream(file)
    .pipe(csv({skipComments: true}))
    .on('data', (data) => rows.push(data))
    .on('end', async () => {
      console.log('Total rows:', rows.length);
      let i = 0;
      for (const r of rows) {
        try {
          await prisma.candidate.upsert({
            where: { external_id: r.id || r.external_id || null },
            update: {},
            create: {
              external_id: r.id || r.external_id || null,
              name: r.name || r.fullname || r.full_name || '',
              governorate: r.governorate || r.region || '',
              gender: r.gender || '',
              party: r.party || '',
              contact: r.contact || '',
              profile_image: r.profile_image || r.photo || '',
              metadata: JSON.stringify(r)
            }
          });
          i++;
        } catch (e) {
          console.warn('Insert error for row:', e.message);
        }
      }
      console.log(Imported or upserted  candidates.);
      await prisma.();
      process.exit(0);
    });
})();
