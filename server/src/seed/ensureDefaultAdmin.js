const bcrypt = require('bcryptjs');
const prisma = require('../prisma');

const DEFAULT_ADMIN_EMAIL = 'admin@deliciousbites.com';
const DEFAULT_ADMIN_PASSWORD = 'admin123';

async function ensureDefaultAdmin() {
  const existing = await prisma.user.findFirst({
    where: { email: DEFAULT_ADMIN_EMAIL, role: 'admin' }
  });
  if (existing) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, salt);

  await prisma.user.create({
    data: {
      name: 'Default Admin',
      email: DEFAULT_ADMIN_EMAIL,
      password: passwordHash,
      role: 'admin'
    }
  });

  console.log('Default admin user created:', DEFAULT_ADMIN_EMAIL);
}

module.exports = ensureDefaultAdmin;


