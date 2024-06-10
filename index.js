require('dotenv').config()
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const User = require('./models/User');
const hashPassword = require('./middlewares/hashPassword');
const port = 3000;
const db = require('./db');
const { generateToken, authenticateToken } = require('./middlewares/authService');
const cors = require('cors');
app.use(cors({
    origin: "*"
}));
app.use(express.json());

db.sync();

app.get('/', (req, res) => {
  res.json({context: 'Trabalho autenticação'});
});

app.post('/cadastro', hashPassword, async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    res.send(user);
  } catch (error) {
    res.status(500).send(error)
  }
  
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).send('E-mail ou senha inválida');
  }
  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    return res.status(401).send('E-mail ou senha inválida');
  }
  const token = generateToken(user.dataValues);
  delete user.dataValues.password;
  res.send({ user, token });
});

app.get('/usuarios', authenticateToken, async (req, res)=>{
  const users = await User.findAll();
  res.send(users)
})

app.listen(port, () => {
  console.log(`app on http://localhost:${port}`);
});
