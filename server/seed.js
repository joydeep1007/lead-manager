require('dotenv').config();
const db = require('./db');

const SAMPLE_LEADS = [
  {
    name: 'Sarah Chen',
    email: 'sarah.chen@acmelogistics.com',
    phone: '+91 9876543210',
    company: 'Acme Logistics',
    source: 'Website',
    status: 'New',
  },
  {
    name: 'Marcus Vance',
    email: 'mvance@northstarcloud.io',
    phone: '+91 1234567890',
    company: 'Northstar Cloud',
    source: 'Referral',
    status: 'Qualified',
  },
  {
    name: 'Elena Rostova',
    email: 'elena@veridianhealth.com',
    phone: '+91 1122334455',
    company: 'Veridian Health',
    source: 'Cold Call',
    status: 'Contacted',
  },
  {
    name: 'David Kim',
    email: 'dkim@finpulse.co',
    phone: '+91 6465550115',
    company: 'FinPulse',
    source: 'Social',
    status: 'New',
  },
  {
    name: 'Priya Nair',
    email: 'priya.nair@kinetixai.dev',
    phone: '+91 5125550163',
    company: 'Kinetix AI',
    source: 'Website',
    status: 'Qualified',
  },
  {
    name: 'Liam OConnor',
    email: 'liam@harborfreighttech.com',
    phone: '+91 6175550181',
    company: 'Harbor Freight Tech',
    source: 'Referral',
    status: 'Contacted',
  },
  {
    name: 'Hannah Abbott',
    email: 'hannah@bluepeak.org',
    phone: '+91 3035550129',
    company: 'BluePeak Systems',
    source: 'Other',
    status: 'Lost',
  },
  {
    name: 'Carlos Mendez',
    email: 'cmendez@solarisenergy.com',
    phone: '+91 7135550156',
    company: 'Solaris Energy',
    source: 'Website',
    status: 'New',
  },
  {
    name: 'Rachel Green',
    email: 'rachel@brightpath.edu',
    phone: '+91 4045550137',
    company: 'BrightPath Learning',
    source: 'Social',
    status: 'Contacted',
  },
  {
    name: 'Noah Patel',
    email: 'noah.patel@crestlineops.com',
    phone: '+91 6505550188',
    company: 'Crestline Ops',
    source: 'Cold Call',
    status: 'Lost',
  },
];

const { count } = db.prepare('SELECT COUNT(*) AS count FROM leads').get();

if (count > 0 && !process.argv.includes('--force')) {
  console.log(`Database already has ${count} lead(s). Skipping seed (pass --force to add anyway).`);
  process.exit(0);
}

const insert = db.prepare(
  `INSERT INTO leads (name, email, phone, company, source, status, created_at, updated_at)
   VALUES (@name, @email, @phone, @company, @source, @status, datetime('now'), datetime('now'))`
);

const insertMany = db.transaction((leads) => {
  for (const lead of leads) {
    insert.run(lead);
  }
});

insertMany(SAMPLE_LEADS);
console.log(`Seeded ${SAMPLE_LEADS.length} leads into the database.`);
