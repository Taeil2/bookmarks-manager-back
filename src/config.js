module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://taeilkwak@localhost/bookmarks-manager',
  JWT_SECRET: process.env.JWT_SECRET || 'F3AF6D7AD0C4A29617B02846BE28C6A4A64E5FD3D6D02CF3BF9CB50D01A745B9',
  API_TOKEN: process.env.API_TOKEN || '893hjhks-s87s9fh-8sdfhb-iy8778bhk'
}
