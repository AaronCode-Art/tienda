import jsonServer from 'json-server';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults({});

const allowedDistricts = [
  'Miraflores',
  'San Isidro',
  'Surco',
  'San Miguel',
  'Los Olivos',
  'Barranco',
  'San Borja',
  'La Molina'
];

const hasConsecutiveNumbers = (password) => {
  const digits = password.replace(/[^0-9]/g, '');
  for (let i = 0; i + 2 < digits.length; i += 1) {
    const a = Number(digits[i]);
    const b = Number(digits[i + 1]);
    const c = Number(digits[i + 2]);
    if (a + 1 === b && b + 1 === c) return true;
    if (a - 1 === b && b - 1 === c) return true;
  }
  return false;
};

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/usuarios', (req, res, next) => {
  const { nombre, apellido, dni, distrito, correo, contrasena, direccion, referencia, codigo_postal } = req.body;

  if (!nombre || !apellido || !dni || !distrito || !correo || !contrasena || !direccion || !codigo_postal) {
    return res.status(400).json({ message: 'Completa todos los campos obligatorios.' });
  }

  if (!/^[0-9]{8}$/.test(dni)) {
    return res.status(400).json({ message: 'DNI debe tener exactamente 8 dígitos.' });
  }

  if (!allowedDistricts.includes(distrito)) {
    return res.status(400).json({ message: 'Selecciona un distrito válido de Lima.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) {
    return res.status(400).json({ message: 'Correo electrónico inválido.' });
  }

  if (contrasena.length < 8) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres.' });
  }

  if (!/[A-Z]/.test(contrasena)) {
    return res.status(400).json({ message: 'La contraseña debe contener al menos una letra mayúscula.' });
  }

  if (!/[0-9]/.test(contrasena)) {
    return res.status(400).json({ message: 'La contraseña debe incluir al menos un número.' });
  }

  if (hasConsecutiveNumbers(contrasena)) {
    return res.status(400).json({ message: 'La contraseña no puede contener números consecutivos.' });
  }

  const usuarios = router.db.get('usuarios').value();
  const emailExists = usuarios.some((user) => user.correo.toLowerCase() === correo.toLowerCase());
  if (emailExists) {
    return res.status(400).json({ message: 'Ya existe una cuenta con ese correo.' });
  }

  req.body.id = `u${Date.now()}`;
  next();
});

server.use(router);
server.listen(3001, () => {
  // eslint-disable-next-line no-console
  console.log('JSON Server is running on http://localhost:3001');
});
