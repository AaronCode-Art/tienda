import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Encabezado from '../../components/layouts/Encabezado';
import Footer from '../../components/layouts/Footer';
import { useAuth } from '../../hooks/useAuth';
import { usuarioService } from '../../services/UsuarioService';
import './accountPage.css';

const DISTRICTS = [
  'Miraflores',
  'San Isidro',
  'Surco',
  'San Miguel',
  'Los Olivos',
  'Barranco',
  'San Borja',
  'La Molina',
];

const hasConsecutiveNumbers = (value: string) => {
  const digits = value.replace(/[^0-9]/g, '');
  for (let i = 0; i + 2 < digits.length; i += 1) {
    const a = Number(digits[i]);
    const b = Number(digits[i + 1]);
    const c = Number(digits[i + 2]);
    if (a + 1 === b && b + 1 === c) return true;
    if (a - 1 === b && b - 1 === c) return true;
  }
  return false;
};

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password: string) => {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    noConsecutiveNumbers: !hasConsecutiveNumbers(password),
  };
};

const AccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginCorreo, setLoginCorreo] = useState('');
  const [loginContrasena, setLoginContrasena] = useState('');
  const [registerForm, setRegisterForm] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    distrito: '',
    direccion: '',
    referencia: '',
    codigo_postal: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/';

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEmail(loginCorreo)) {
      setError('Ingresa un correo válido.');
      return;
    }

    const successLogin = await login(loginCorreo, loginContrasena);
    if (successLogin) {
      navigate(from, { replace: true });
      return;
    }

    setError('Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo.');
  };

  const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const {
      nombre,
      apellido,
      dni,
      distrito,
      direccion,
      referencia,
      codigo_postal,
      correo,
      contrasena,
      confirmarContrasena,
    } = registerForm;

    if (!nombre || !apellido || !dni || !distrito || !direccion || !codigo_postal || !correo || !contrasena || !confirmarContrasena) {
      setError('Completa todos los campos obligatorios.');
      return;
    }

    if (!/^[0-9]{8}$/.test(dni)) {
      setError('El DNI debe tener exactamente 8 dígitos.');
      return;
    }

    if (!DISTRICTS.includes(distrito)) {
      setError('Selecciona un distrito válido de Lima.');
      return;
    }

    if (!validateEmail(correo)) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }

    const passwordValidation = validatePassword(contrasena);
    if (!passwordValidation.minLength) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (!passwordValidation.hasUppercase) {
      setError('La contraseña debe contener al menos una letra mayúscula.');
      return;
    }

    if (!passwordValidation.hasNumber) {
      setError('La contraseña debe contener al menos un número.');
      return;
    }

    if (!passwordValidation.noConsecutiveNumbers) {
      setError('La contraseña no puede tener números consecutivos.');
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await usuarioService.register({
        nombre,
        apellido,
        dni,
        distrito,
        direccion,
        referencia,
        codigo_postal,
        correo,
        contrasena,
      });

      const successLogin = await login(correo, contrasena);
      if (successLogin) {
        navigate(from, { replace: true });
        setSuccess('Registro exitoso. Redirigiendo...');
      } else {
        setSuccess('Registro guardado. Ahora inicia sesión.');
        setActiveTab('login');
      }
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Error durante el registro.');
    }
  };

  const handleRegisterChange = (field: string, value: string) => {
    setRegisterForm((prev) => ({ ...prev, [field]: value }));
  };

  const passwordValidation = validatePassword(registerForm.contrasena);

  return (
    <div className="account-page">
      <Encabezado showBanner={false} />
      <main className="account-content">
        <section className="account-card account-card-wide">
          <div className="account-tabs">
            <button
              type="button"
              className={activeTab === 'login' ? 'active' : ''}
              onClick={() => {
                setActiveTab('login');
                setError('');
                setSuccess('');
              }}
            >
              Inicio de sesión
            </button>
            <button
              type="button"
              className={activeTab === 'register' ? 'active' : ''}
              onClick={() => {
                setActiveTab('register');
                setError('');
                setSuccess('');
              }}
            >
              Registrar cuenta
            </button>
          </div>

          {activeTab === 'login' ? (
            <div className="account-form-section">
              <h1>Bienvenido de nuevo</h1>
              <p>Accede con tu correo y contraseña.</p>

              <form className="account-form" onSubmit={handleLoginSubmit}>
                <label>
                  Correo electrónico
                  <input
                    type="email"
                    value={loginCorreo}
                    onChange={(event) => setLoginCorreo(event.target.value)}
                    placeholder="usuario@correo.com"
                    required
                  />
                </label>

                <label>
                  Contraseña
                  <input
                    type="password"
                    value={loginContrasena}
                    onChange={(event) => setLoginContrasena(event.target.value)}
                    placeholder="********"
                    required
                  />
                </label>

                <button type="submit" className="account-submit-button">
                  Iniciar sesión
                </button>
              </form>
            </div>
          ) : (
            <div className="account-form-section">
              <h1>Crea tu cuenta</h1>
              <p>Registra tus datos para comprar con seguridad.</p>

              <form className="account-form" onSubmit={handleRegisterSubmit}>
                <div className="two-columns">
                  <label>
                    Nombre
                    <input
                      type="text"
                      value={registerForm.nombre}
                      onChange={(event) => handleRegisterChange('nombre', event.target.value)}
                      placeholder="Nombre"
                      required
                    />
                  </label>
                  <label>
                    Apellido
                    <input
                      type="text"
                      value={registerForm.apellido}
                      onChange={(event) => handleRegisterChange('apellido', event.target.value)}
                      placeholder="Apellido"
                      required
                    />
                  </label>
                </div>

                <div className="two-columns">
                  <label>
                    DNI
                    <input
                      type="text"
                      value={registerForm.dni}
                      maxLength={8}
                      onChange={(event) => handleRegisterChange('dni', event.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="12345678"
                      required
                    />
                  </label>
                  <label>
                    Distrito
                    <select
                      value={registerForm.distrito}
                      onChange={(event) => handleRegisterChange('distrito', event.target.value)}
                      required
                    >
                      <option value="">Selecciona un distrito</option>
                      {DISTRICTS.map((distrito) => (
                        <option key={distrito} value={distrito}>{distrito}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label>
                  Dirección
                  <input
                    type="text"
                    value={registerForm.direccion}
                    onChange={(event) => handleRegisterChange('direccion', event.target.value)}
                    placeholder="Av. ejemplo 123"
                    required
                  />
                </label>

                <label>
                  Referencia
                  <input
                    type="text"
                    value={registerForm.referencia}
                    onChange={(event) => handleRegisterChange('referencia', event.target.value)}
                    placeholder="Referencia para entrega"
                  />
                </label>

                <div className="two-columns">
                  <label>
                    Código postal
                    <input
                      type="text"
                      value={registerForm.codigo_postal}
                      onChange={(event) => handleRegisterChange('codigo_postal', event.target.value)}
                      placeholder="15074"
                      required
                    />
                  </label>
                  <label>
                    Correo electrónico
                    <input
                      type="email"
                      value={registerForm.correo}
                      onChange={(event) => handleRegisterChange('correo', event.target.value)}
                      placeholder="usuario@correo.com"
                      required
                    />
                  </label>
                </div>

                <label>
                  Contraseña
                  <input
                    type="password"
                    value={registerForm.contrasena}
                    onChange={(event) => handleRegisterChange('contrasena', event.target.value)}
                    placeholder="Contraseña segura"
                    required
                  />
                </label>

                <label>
                  Confirmar contraseña
                  <input
                    type="password"
                    value={registerForm.confirmarContrasena}
                    onChange={(event) => handleRegisterChange('confirmarContrasena', event.target.value)}
                    placeholder="Repite la contraseña"
                    required
                  />
                </label>

                <button type="submit" className="account-submit-button">
                  Crear cuenta
                </button>
              </form>

              <div className="account-conditions-box">
                <h2>Condiciones de registro</h2>
                <ul>
                  <li>DNI debe tener exactamente 8 dígitos.</li>
                  <li>Distrito solo puede ser de Lima.</li>
                  <li>Correo válido con formato correcto.</li>
                  <li>Contraseña mínimo 8 caracteres.</li>
                  <li>Debe tener al menos una letra mayúscula.</li>
                  <li>Debe contener números no consecutivos.</li>
                </ul>
                <div className="password-checklist">
                  <p className={passwordValidation.minLength ? 'valid' : ''}>8 caracteres mínimo</p>
                  <p className={passwordValidation.hasUppercase ? 'valid' : ''}>Al menos una mayúscula</p>
                  <p className={passwordValidation.hasNumber ? 'valid' : ''}>Incluye un número</p>
                  <p className={passwordValidation.noConsecutiveNumbers ? 'valid' : ''}>No números consecutivos</p>
                </div>
              </div>
            </div>
          )}

          {(error || success) && (
            <div className={`account-message ${error ? 'account-error' : 'account-success'}`}>
              {error || success}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AccountPage;
