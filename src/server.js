require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Site da Amanda no ar: http://localhost:${PORT}`);
  console.log('Painel admin: http://localhost:' + PORT + '/admin');
});