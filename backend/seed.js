const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const Lead = require('./models/Lead');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected for seeding');

    await Lead.deleteMany();

    const leads = [];

    for (let i = 0; i < 1000; i++) {
      leads.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        status: faker.helpers.arrayElement(['New', 'Contacted', 'Converted']),
        source: faker.helpers.arrayElement(['Website', 'Referral', 'Ads'])

      });
    }

    await Lead.insertMany(leads);
    console.log('1000 leads inserted');

    process.exit();
  })
  .catch(err => console.error(err));
