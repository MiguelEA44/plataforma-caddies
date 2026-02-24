/* ==========================================
   SISTEMA DE GESTIÓN DE CLUB DE TENIS
   Club Tenis Colombia - Script Principal
   ========================================== */

let currentUser = null;
let currentView = 'dashboard';
const TARIFA_HORA = 18000; // Pesos colombianos

// Avatares reales (Unsplash - cara)
const AVATARES_HOMBRE = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?w=80&h=80&fit=crop&crop=face',
];
const AVATARES_MUJER = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face',
];

function getAvatar(nombre, id) {
  const nombresF = ['María','Laura','Carolina','Valentina','Daniela','Camila','Sofía','Luisa','Paola','Andrea','Sandra','Natalia','Sara','Isabella'];
  const esFemenino = nombresF.some(n => (nombre||'').startsWith(n));
  const arr = esFemenino ? AVATARES_MUJER : AVATARES_HOMBRE;
  return arr[(id || 0) % arr.length];
}

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
  if (!localStorage.getItem('initialized')) {
    initializeTestData();
    localStorage.setItem('initialized', 'true');
  }
  setupEventListeners();
  checkSession();
});

function initializeTestData() {
  let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  if (usuarios.length === 0) {
    usuarios = [{
      id: 1, username: 'admin', password: 'admin123',
      nombre: 'Carlos Rodríguez', role: 'admin', estado: 'activo',
      canchaAsignada: null,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face'
    }];
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  if (!localStorage.getItem('canchas')) {
    localStorage.setItem('canchas', JSON.stringify([
      { id: 1, nombre: 'Cancha Central', tipo: 'Polvo de Ladrillo', estado: 'disponible', empleadoAsignado: null },
      { id: 2, nombre: 'Cancha Norte', tipo: 'Cemento', estado: 'disponible', empleadoAsignado: null },
      { id: 3, nombre: 'Cancha Sur', tipo: 'Cemento', estado: 'reservada', empleadoAsignado: null },
      { id: 4, nombre: 'Cancha VIP', tipo: 'Césped Sintético', estado: 'disponible', empleadoAsignado: null },
      { id: 5, nombre: 'Cancha Olímpica', tipo: 'Polvo de Ladrillo', estado: 'ocupada', empleadoAsignado: null },
      { id: 6, nombre: 'Cancha Juvenil', tipo: 'Cemento', estado: 'disponible', empleadoAsignado: null }
    ]));
  }

  if (!localStorage.getItem('clientes')) {
    localStorage.setItem('clientes', JSON.stringify([
      { id: 1, nombre: 'Andrés Felipe Gómez', email: 'andres.gomez@gmail.com', telefono: '310 456 7890', ciudad: 'Bogotá', reservas: 12, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face' },
      { id: 2, nombre: 'María Camila Torres', email: 'mcamila.torres@hotmail.com', telefono: '315 234 5678', ciudad: 'Medellín', reservas: 8, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face' },
      { id: 3, nombre: 'Sebastián Muñoz Vargas', email: 'sebas.munoz@outlook.com', telefono: '300 987 6543', ciudad: 'Cali', reservas: 15, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face' },
      { id: 4, nombre: 'Valentina Herrera López', email: 'vale.herrera@yahoo.com', telefono: '318 765 4321', ciudad: 'Barranquilla', reservas: 5, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face' },
      { id: 5, nombre: 'Juan Pablo Ospina', email: 'jp.ospina@gmail.com', telefono: '312 111 2233', ciudad: 'Bogotá', reservas: 20, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face' },
      { id: 6, nombre: 'Luisa Fernanda Ríos', email: 'luisa.rios@gmail.com', telefono: '316 333 4455', ciudad: 'Pereira', reservas: 3, avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face' },
    ]));
  }

  if (!localStorage.getItem('turnos')) localStorage.setItem('turnos', JSON.stringify([]));
  if (!localStorage.getItem('pagos')) localStorage.setItem('pagos', JSON.stringify([]));
}

// ==========================================
// SESIÓN
// ==========================================
function checkSession() {
  const session = localStorage.getItem('currentSession');
  if (session) {
    currentUser = JSON.parse(session);
    showDashboard(false);
  } else {
    showLogin();
  }
}

function showLogin() {
  const ls = document.getElementById('login-screen');
  const ds = document.getElementById('dashboard-screen');
  ds.classList.remove('active');
  ls.classList.add('active');
  ls.style.opacity = '0';
  ls.style.transform = 'scale(0.98)';
  requestAnimationFrame(() => {
    ls.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    ls.style.opacity = '1';
    ls.style.transform = 'scale(1)';
  });
}

function showDashboard(animate = true) {
  const ls = document.getElementById('login-screen');
  const ds = document.getElementById('dashboard-screen');

  function doShow() {
    ls.classList.remove('active');
    ls.style.transition = '';
    ls.style.opacity = '';
    ls.style.transform = '';
    ds.style.opacity = '0';
    ds.classList.add('active');
    requestAnimationFrame(() => {
      ds.style.transition = 'opacity 0.5s ease';
      ds.style.opacity = '1';
      setTimeout(() => { ds.style.transition = ''; }, 500);
    });
    // Actualizar navbar
    document.getElementById('user-name').textContent = currentUser.nombre;
    document.getElementById('user-role').textContent = currentUser.role === 'admin' ? 'Administrador' : 'Empleado';
    const navAvatar = document.getElementById('nav-avatar');
    if (navAvatar) {
      navAvatar.src = currentUser.avatar || getAvatar(currentUser.nombre, currentUser.id);
    }
    updateUIByRole();
    navigateToView('dashboard');
  }

  if (animate) {
    ls.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    ls.style.opacity = '0';
    ls.style.transform = 'scale(1.04)';
    setTimeout(doShow, 450);
  } else {
    doShow();
  }
}

function updateUIByRole() {
  document.querySelectorAll('.admin-only').forEach(el => el.style.display = currentUser.role === 'admin' ? '' : 'none');
  document.querySelectorAll('.empleado-action').forEach(el => el.style.display = currentUser.role === 'empleado' ? '' : 'none');
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('register-form').addEventListener('submit', handleRegister);
  document.getElementById('toggle-auth-link').addEventListener('click', toggleAuthForms);
  document.getElementById('logout-btn').addEventListener('click', handleLogout);

  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() { navigateToView(this.getAttribute('data-view')); });
  });

  document.getElementById('btn-nueva-cancha').addEventListener('click', () => openCanchaModal());
  document.getElementById('btn-nuevo-empleado').addEventListener('click', () => openEmpleadoModal());
  document.getElementById('btn-nuevo-cliente').addEventListener('click', () => openClienteModal());
  document.getElementById('btn-registrar-turno').addEventListener('click', () => openTurnoModal());
  document.getElementById('btn-procesar-pagos').addEventListener('click', procesarPagosPendientes);
  document.getElementById('btn-filtrar-reporte').addEventListener('click', filtrarReporte);
  document.getElementById('btn-exportar-reporte').addEventListener('click', exportarReporte);
  document.getElementById('form-perfil-info').addEventListener('submit', guardarPerfilInfo);
  document.getElementById('form-cambiar-password').addEventListener('submit', cambiarPassword);
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal').addEventListener('click', function(e) { if (e.target === this) closeModal(); });
  setupFAQToggles();
}

// ==========================================
// LOGIN / LOGOUT
// ==========================================
function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const loginBtn = document.querySelector('#login-form button[type="submit"]');
  const loginLoading = document.getElementById('login-loading');
  loginBtn.style.display = 'none';
  loginLoading.classList.add('active');

  setTimeout(() => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const user = usuarios.find(u => u.username === username && u.password === password);
    if (user) {
      currentUser = user;
      localStorage.setItem('currentSession', JSON.stringify(user));
      loginBtn.style.display = '';
      loginLoading.classList.remove('active');
      document.getElementById('login-form').reset();
      showDashboard(true);
      setTimeout(() => showNotification('¡Bienvenido!', `Hola ${user.nombre.split(' ')[0]}, bienvenido al sistema`, 'success'), 700);
    } else {
      showNotification('Error de acceso', 'Usuario o contraseña incorrectos', 'error');
      loginBtn.style.display = '';
      loginLoading.classList.remove('active');
    }
  }, 800);
}

function handleRegister(e) {
  e.preventDefault();
  const nombre = document.getElementById('reg-nombre').value.trim();
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value;
  const passwordConfirm = document.getElementById('reg-password-confirm').value;
  const role = document.getElementById('reg-role').value;

  if (password !== passwordConfirm) { showNotification('Error', 'Las contraseñas no coinciden', 'error'); return; }
  if (password.length < 6) { showNotification('Error', 'Mínimo 6 caracteres en la contraseña', 'error'); return; }

  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  if (usuarios.find(u => u.username === username)) { showNotification('Error', 'El usuario ya existe', 'error'); return; }

  const newId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
  usuarios.push({ id: newId, username, password, nombre, role, estado: 'activo', canchaAsignada: null, avatar: getAvatar(nombre, newId) });
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  showNotification('¡Registro exitoso!', 'Ya puedes iniciar sesión', 'success');
  document.getElementById('register-form').reset();
  toggleAuthForms();
}

function toggleAuthForms(e) {
  if (e) e.preventDefault();
  const lf = document.getElementById('login-form');
  const rf = document.getElementById('register-form');
  const tt = document.getElementById('toggle-auth-text');
  const tl = document.getElementById('toggle-auth-link');
  if (lf.classList.contains('active')) {
    lf.classList.remove('active'); rf.classList.add('active');
    tt.innerHTML = '¿Ya tienes cuenta? '; tl.textContent = 'Inicia sesión aquí';
  } else {
    rf.classList.remove('active'); lf.classList.add('active');
    tt.innerHTML = '¿No tienes cuenta? '; tl.textContent = 'Regístrate aquí';
  }
}

function handleLogout() {
  localStorage.removeItem('currentSession');
  currentUser = null;
  const ds = document.getElementById('dashboard-screen');
  ds.style.transition = 'opacity 0.3s ease';
  ds.style.opacity = '0';
  setTimeout(() => { ds.style.opacity = '1'; ds.style.transition = ''; currentView = 'dashboard'; showLogin(); }, 300);
}

// ==========================================
// NAVEGACIÓN
// ==========================================
function navigateToView(viewName) {
  document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
  const mi = document.querySelector(`[data-view="${viewName}"]`);
  if (mi) mi.classList.add('active');
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const ve = document.getElementById(`view-${viewName}`);
  if (ve) ve.classList.add('active');
  currentView = viewName;
  loadViewData(viewName);
}

function loadViewData(v) {
  switch(v) {
    case 'dashboard': loadDashboard(); break;
    case 'canchas': loadCanchas(); break;
    case 'empleados': loadEmpleados(); break;
    case 'clientes': loadClientes(); break;
    case 'turnos': loadTurnos(); break;
    case 'pagos': loadPagos(); break;
    case 'reportes': loadReportes(); break;
    case 'perfil': loadPerfil(); break;
  }
}

// ==========================================
// DASHBOARD
// ==========================================
function loadDashboard() {
  const canchas = JSON.parse(localStorage.getItem('canchas') || '[]');
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  document.getElementById('stat-disponibles').textContent = canchas.filter(c => c.estado === 'disponible').length;
  document.getElementById('stat-ocupadas').textContent = canchas.filter(c => c.estado === 'ocupada').length;
  document.getElementById('stat-reservadas').textContent = canchas.filter(c => c.estado === 'reservada').length;
  document.getElementById('stat-empleados').textContent = usuarios.filter(u => u.role === 'empleado').length;
  renderCanchasGrid(canchas);
}

function renderCanchasGrid(canchas) {
  const grid = document.getElementById('canchas-grid');
  grid.innerHTML = '';
  const labels = { disponible: 'Disponible', ocupada: 'Ocupada', reservada: 'Reservada' };
  canchas.forEach(c => {
    const card = document.createElement('div');
    card.className = `cancha-card ${c.estado}`;
    card.setAttribute('data-testid', `court-card-${c.id}`);
    card.innerHTML = `<i class="fas fa-tennis-ball"></i><h4>${c.nombre}</h4><p>${c.tipo}</p><span class="status">${labels[c.estado]||c.estado}</span>`;
    card.addEventListener('click', () => openCanchaDetailsModal(c));
    grid.appendChild(card);
  });
}

// ==========================================
// CANCHAS
// ==========================================
function loadCanchas() {
  const canchas = JSON.parse(localStorage.getItem('canchas') || '[]');
  const list = document.getElementById('canchas-list');
  list.innerHTML = '';
  canchas.forEach(c => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const emp = usuarios.find(u => u.id === c.empleadoAsignado);
    const colores = { disponible: 'var(--success)', ocupada: 'var(--danger)', reservada: 'var(--warning)' };
    const item = document.createElement('div');
    item.className = 'cancha-item'; item.setAttribute('data-testid', `court-item-${c.id}`);
    item.innerHTML = `
      <div class="cancha-item-header">
        <h3>${c.nombre}</h3>
        <span class="badge" style="background:${colores[c.estado]}">${c.estado.toUpperCase()}</span>
      </div>
      <div class="cancha-item-body">
        <p><strong>Tipo:</strong> ${c.tipo}</p>
        <p><strong>Empleado:</strong> ${emp ? `<img src="${emp.avatar||getAvatar(emp.nombre,emp.id)}" class="avatar-mini" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(emp.nombre)}&background=2E7D32&color=fff&size=32'"> ${emp.nombre}` : 'Sin asignar'}</p>
      </div>
      <div class="cancha-item-actions">
        <button class="btn btn-secondary btn-sm" onclick="cambiarEstadoCancha(${c.id})"><i class="fas fa-sync-alt"></i> Estado</button>
        <button class="btn btn-primary btn-sm admin-only" onclick="asignarEmpleadoCancha(${c.id})"><i class="fas fa-user-plus"></i> Asignar</button>
        <button class="btn btn-danger btn-sm admin-only" onclick="eliminarCancha(${c.id})"><i class="fas fa-trash"></i></button>
      </div>`;
    list.appendChild(item);
  });
  updateUIByRole();
}

function openCanchaModal(cancha = null) {
  const isEdit = cancha !== null;
  document.getElementById('modal-title').textContent = isEdit ? 'Editar Cancha' : 'Nueva Cancha';
  document.getElementById('modal-body').innerHTML = `
    <form id="form-cancha">
      <div class="form-group"><label>Nombre</label><input type="text" id="cancha-nombre" value="${isEdit?cancha.nombre:''}" required></div>
      <div class="form-group"><label>Tipo de Superficie</label>
        <select id="cancha-tipo" required>
          <option value="Polvo de Ladrillo" ${isEdit&&cancha.tipo==='Polvo de Ladrillo'?'selected':''}>Polvo de Ladrillo</option>
          <option value="Cemento" ${isEdit&&cancha.tipo==='Cemento'?'selected':''}>Cemento</option>
          <option value="Césped Sintético" ${isEdit&&cancha.tipo==='Césped Sintético'?'selected':''}>Césped Sintético</option>
          <option value="Madera" ${isEdit&&cancha.tipo==='Madera'?'selected':''}>Madera</option>
        </select>
      </div>
      <div class="form-group"><label>Estado</label>
        <select id="cancha-estado" required>
          <option value="disponible" ${isEdit&&cancha.estado==='disponible'?'selected':''}>Disponible</option>
          <option value="ocupada" ${isEdit&&cancha.estado==='ocupada'?'selected':''}>Ocupada</option>
          <option value="reservada" ${isEdit&&cancha.estado==='reservada'?'selected':''}>Reservada</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> ${isEdit?'Actualizar':'Crear'} Cancha</button>
    </form>`;
  document.getElementById('form-cancha').addEventListener('submit', e => { e.preventDefault(); isEdit?updateCancha(cancha.id):createCancha(); });
  openModal();
}

function createCancha() {
  const canchas = JSON.parse(localStorage.getItem('canchas') || '[]');
  const newId = canchas.length > 0 ? Math.max(...canchas.map(c => c.id)) + 1 : 1;
  canchas.push({ id: newId, nombre: document.getElementById('cancha-nombre').value, tipo: document.getElementById('cancha-tipo').value, estado: document.getElementById('cancha-estado').value, empleadoAsignado: null });
  localStorage.setItem('canchas', JSON.stringify(canchas));
  showNotification('¡Éxito!', 'Cancha creada correctamente', 'success'); closeModal(); loadCanchas(); loadDashboard();
}

function updateCancha(id) {
  const canchas = JSON.parse(localStorage.getItem('canchas') || '[]');
  const c = canchas.find(x => x.id === id);
  if (c) { c.nombre=document.getElementById('cancha-nombre').value; c.tipo=document.getElementById('cancha-tipo').value; c.estado=document.getElementById('cancha-estado').value; localStorage.setItem('canchas',JSON.stringify(canchas)); showNotification('¡Éxito!','Cancha actualizada','success'); closeModal(); loadCanchas(); loadDashboard(); }
}

function cambiarEstadoCancha(id) {
  const canchas = JSON.parse(localStorage.getItem('canchas') || '[]');
  const c = canchas.find(x => x.id === id);
  if (c) { const e=['disponible','ocupada','reservada']; c.estado=e[(e.indexOf(c.estado)+1)%3]; localStorage.setItem('canchas',JSON.stringify(canchas)); showNotification('Actualizado',`Ahora: ${c.estado}`,'info'); loadCanchas(); loadDashboard(); }
}

function asignarEmpleadoCancha(canchaId) {
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const empleados = usuarios.filter(u => u.role === 'empleado');
  document.getElementById('modal-title').textContent = 'Asignar Empleado a Cancha';
  document.getElementById('modal-body').innerHTML = `
    <form id="form-asignar">
      <div class="form-group"><label>Seleccionar Empleado</label>
        <select id="empleado-select" required>
          <option value="">-- Seleccionar --</option>
          ${empleados.map(e=>`<option value="${e.id}">${e.nombre}</option>`).join('')}
        </select>
      </div>
      <button type="submit" class="btn btn-primary"><i class="fas fa-check"></i> Asignar</button>
    </form>`;
  document.getElementById('form-asignar').addEventListener('submit', e => {
    e.preventDefault();
    const eid = parseInt(document.getElementById('empleado-select').value);
    if (!eid) return;
    const canchas = JSON.parse(localStorage.getItem('canchas') || '[]');
    const c = canchas.find(x => x.id === canchaId);
    if (c) { c.empleadoAsignado = eid; localStorage.setItem('canchas', JSON.stringify(canchas)); }
    const usrs = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const emp = usrs.find(u => u.id === eid);
    if (emp) { emp.canchaAsignada = canchaId; localStorage.setItem('usuarios', JSON.stringify(usrs)); }
    showNotification('¡Éxito!','Empleado asignado','success'); closeModal(); loadCanchas();
  });
  openModal();
}

function eliminarCancha(id) {
  if (confirm('¿Eliminar esta cancha?')) {
    localStorage.setItem('canchas', JSON.stringify(JSON.parse(localStorage.getItem('canchas')||'[]').filter(c=>c.id!==id)));
    showNotification('Eliminada','Cancha eliminada','info'); loadCanchas(); loadDashboard();
  }
}

function openCanchaDetailsModal(cancha) {
  const emp = JSON.parse(localStorage.getItem('usuarios')||'[]').find(u=>u.id===cancha.empleadoAsignado);
  document.getElementById('modal-title').textContent = cancha.nombre;
  document.getElementById('modal-body').innerHTML = `
    <div style="padding:10px">
      <p style="margin:12px 0"><strong>Tipo:</strong> ${cancha.tipo}</p>
      <p style="margin:12px 0"><strong>Estado:</strong> <span style="text-transform:uppercase;font-weight:600">${cancha.estado}</span></p>
      <p style="margin:12px 0"><strong>Empleado:</strong> ${emp?`<img src="${emp.avatar||getAvatar(emp.nombre,emp.id)}" class="avatar-mini" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(emp.nombre)}&background=2E7D32&color=fff&size=32'"> ${emp.nombre}`:'Sin asignar'}</p>
    </div>`;
  openModal();
}

// ==========================================
// EMPLEADOS
// ==========================================
function loadEmpleados() {
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const empleados = usuarios.filter(u => u.role === 'empleado');
  const tbody = document.getElementById('empleados-tbody');
  tbody.innerHTML = '';
  if (!empleados.length) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--gray);padding:30px">No hay empleados registrados</td></tr>'; return; }
  empleados.forEach(emp => {
    const canchas = JSON.parse(localStorage.getItem('canchas') || '[]');
    const cancha = canchas.find(c => c.id === emp.canchaAsignada);
    const avatarSrc = emp.avatar || getAvatar(emp.nombre, emp.id);
    const row = document.createElement('tr');
    row.setAttribute('data-testid', `employee-row-${emp.id}`);
    row.innerHTML = `
      <td>${emp.id}</td>
      <td><div class="table-person"><img src="${avatarSrc}" class="avatar-table" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(emp.nombre)}&background=2E7D32&color=fff&size=40'"><span>${emp.nombre}</span></div></td>
      <td>${emp.username}</td>
      <td>${cancha?cancha.nombre:'Sin asignar'}</td>
      <td><span class="badge" style="background:${emp.estado==='activo'?'var(--success)':'var(--danger)'}">${(emp.estado||'activo').toUpperCase()}</span></td>
      <td class="actions">
        <button class="btn btn-secondary btn-sm" onclick="editarEmpleado(${emp.id})"><i class="fas fa-edit"></i></button>
        <button class="btn btn-danger btn-sm" onclick="eliminarEmpleado(${emp.id})"><i class="fas fa-trash"></i></button>
      </td>`;
    tbody.appendChild(row);
  });
}

function openEmpleadoModal(empleado = null) {
  const isEdit = empleado !== null;
  document.getElementById('modal-title').textContent = isEdit ? 'Editar Empleado' : 'Nuevo Empleado';
  document.getElementById('modal-body').innerHTML = `
    <form id="form-empleado">
      <div class="form-group"><label>Nombre Completo</label><input type="text" id="empleado-nombre" value="${isEdit?empleado.nombre:''}" required></div>
      <div class="form-group"><label>Usuario</label><input type="text" id="empleado-username" value="${isEdit?empleado.username:''}" required></div>
      <div class="form-group"><label>Contraseña ${isEdit?'(vacío = sin cambios)':''}</label><input type="password" id="empleado-password" ${isEdit?'':'required'}></div>
      <div class="form-group"><label>Estado</label>
        <select id="empleado-estado">
          <option value="activo" ${isEdit&&empleado.estado==='activo'?'selected':''}>Activo</option>
          <option value="inactivo" ${isEdit&&empleado.estado==='inactivo'?'selected':''}>Inactivo</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> ${isEdit?'Actualizar':'Crear'} Empleado</button>
    </form>`;
  document.getElementById('form-empleado').addEventListener('submit', e => { e.preventDefault(); isEdit?updateEmpleado(empleado.id):createEmpleado(); });
  openModal();
}

function createEmpleado() {
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const username = document.getElementById('empleado-username').value.trim();
  if (usuarios.find(u => u.username === username)) { showNotification('Error','Usuario ya existe','error'); return; }
  const newId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
  const nombre = document.getElementById('empleado-nombre').value;
  usuarios.push({ id: newId, username, password: document.getElementById('empleado-password').value, nombre, role: 'empleado', estado: document.getElementById('empleado-estado').value, canchaAsignada: null, avatar: getAvatar(nombre, newId) });
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  showNotification('¡Éxito!','Empleado creado','success'); closeModal(); loadEmpleados();
}

function updateEmpleado(id) {
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const emp = usuarios.find(u => u.id === id);
  if (emp) { emp.nombre=document.getElementById('empleado-nombre').value; emp.username=document.getElementById('empleado-username').value; emp.estado=document.getElementById('empleado-estado').value; const np=document.getElementById('empleado-password').value; if(np)emp.password=np; localStorage.setItem('usuarios',JSON.stringify(usuarios)); showNotification('¡Éxito!','Empleado actualizado','success'); closeModal(); loadEmpleados(); }
}

function editarEmpleado(id) { const u=JSON.parse(localStorage.getItem('usuarios')||'[]').find(x=>x.id===id); if(u)openEmpleadoModal(u); }
function eliminarEmpleado(id) { if(confirm('¿Eliminar este empleado?')){ localStorage.setItem('usuarios',JSON.stringify(JSON.parse(localStorage.getItem('usuarios')||'[]').filter(u=>u.id!==id))); showNotification('Eliminado','Empleado eliminado','info'); loadEmpleados(); } }

// ==========================================
// CLIENTES
// ==========================================
function loadClientes() {
  const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
  const tbody = document.getElementById('clientes-tbody');
  tbody.innerHTML = '';
  clientes.forEach(c => {
    const avatarSrc = c.avatar || getAvatar(c.nombre, c.id);
    const row = document.createElement('tr');
    row.setAttribute('data-testid', `client-row-${c.id}`);
    row.innerHTML = `
      <td>${c.id}</td>
      <td><div class="table-person"><img src="${avatarSrc}" class="avatar-table" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(c.nombre)}&background=1976D2&color=fff&size=40'"><span>${c.nombre}</span></div></td>
      <td>${c.email}</td>
      <td>${c.telefono}</td>
      <td>${c.ciudad||'Colombia'}</td>
      <td><span class="badge" style="background:var(--primary)">${c.reservas}</span></td>
      <td class="actions">
        <button class="btn btn-secondary btn-sm" onclick="editarCliente(${c.id})"><i class="fas fa-edit"></i></button>
        <button class="btn btn-danger btn-sm" onclick="eliminarCliente(${c.id})"><i class="fas fa-trash"></i></button>
      </td>`;
    tbody.appendChild(row);
  });
}

function openClienteModal(cliente = null) {
  const isEdit = cliente !== null;
  const ciudades = ['Bogotá','Medellín','Cali','Barranquilla','Cartagena','Bucaramanga','Pereira','Manizales','Cúcuta','Santa Marta','Ibagué','Villavicencio'];
  document.getElementById('modal-title').textContent = isEdit ? 'Editar Cliente' : 'Nuevo Cliente';
  document.getElementById('modal-body').innerHTML = `
    <form id="form-cliente">
      <div class="form-group"><label>Nombre Completo</label><input type="text" id="cliente-nombre" value="${isEdit?cliente.nombre:''}" required></div>
      <div class="form-group"><label>Correo Electrónico</label><input type="email" id="cliente-email" value="${isEdit?cliente.email:''}" required></div>
      <div class="form-group"><label>Teléfono (COL)</label><input type="tel" id="cliente-telefono" value="${isEdit?cliente.telefono:''}" placeholder="310 000 0000" required></div>
      <div class="form-group"><label>Ciudad</label>
        <select id="cliente-ciudad">${ciudades.map(ci=>`<option value="${ci}" ${isEdit&&cliente.ciudad===ci?'selected':''}>${ci}</option>`).join('')}</select>
      </div>
      <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> ${isEdit?'Actualizar':'Crear'} Cliente</button>
    </form>`;
  document.getElementById('form-cliente').addEventListener('submit', e => { e.preventDefault(); isEdit?updateCliente(cliente.id):createCliente(); });
  openModal();
}

function createCliente() {
  const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
  const newId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
  const nombre = document.getElementById('cliente-nombre').value;
  clientes.push({ id: newId, nombre, email: document.getElementById('cliente-email').value, telefono: document.getElementById('cliente-telefono').value, ciudad: document.getElementById('cliente-ciudad').value, reservas: 0, avatar: getAvatar(nombre, newId) });
  localStorage.setItem('clientes', JSON.stringify(clientes));
  showNotification('¡Éxito!','Cliente creado','success'); closeModal(); loadClientes();
}

function updateCliente(id) {
  const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
  const c = clientes.find(x => x.id === id);
  if (c) { c.nombre=document.getElementById('cliente-nombre').value; c.email=document.getElementById('cliente-email').value; c.telefono=document.getElementById('cliente-telefono').value; c.ciudad=document.getElementById('cliente-ciudad').value; localStorage.setItem('clientes',JSON.stringify(clientes)); showNotification('¡Éxito!','Cliente actualizado','success'); closeModal(); loadClientes(); }
}

function editarCliente(id) { const c=JSON.parse(localStorage.getItem('clientes')||'[]').find(x=>x.id===id); if(c)openClienteModal(c); }
function eliminarCliente(id) { if(confirm('¿Eliminar este cliente?')){ localStorage.setItem('clientes',JSON.stringify(JSON.parse(localStorage.getItem('clientes')||'[]').filter(c=>c.id!==id))); showNotification('Eliminado','Cliente eliminado','info'); loadClientes(); } }

// ==========================================
// TURNOS
// ==========================================
function loadTurnos() {
  const turnos = JSON.parse(localStorage.getItem('turnos') || '[]');
  const tbody = document.getElementById('turnos-tbody');
  tbody.innerHTML = '';
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const canchas = JSON.parse(localStorage.getItem('canchas') || '[]');
  let lista = currentUser.role === 'empleado' ? turnos.filter(t => t.empleadoId === currentUser.id) : turnos;
  if (!lista.length) { tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--gray);padding:30px">No hay turnos registrados</td></tr>'; return; }
  lista.forEach(t => {
    const emp = usuarios.find(u => u.id === t.empleadoId);
    const c = canchas.find(x => x.id === t.canchaId);
    const col = t.estado==='aprobado'||t.estado==='pagado' ? 'var(--success)' : t.estado==='pendiente' ? 'var(--warning)' : 'var(--info)';
    const avatarSrc = emp ? (emp.avatar||getAvatar(emp.nombre,emp.id)) : '';
    const row = document.createElement('tr');
    row.setAttribute('data-testid', `shift-row-${t.id}`);
    row.innerHTML = `
      <td>${t.id}</td>
      <td><div class="table-person">${emp?`<img src="${avatarSrc}" class="avatar-table" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(emp.nombre)}&background=2E7D32&color=fff&size=40'">`:''}<span>${emp?emp.nombre:'N/A'}</span></div></td>
      <td>${c?c.nombre:'N/A'}</td>
      <td>${formatDateTime(t.inicio)}</td>
      <td>${t.fin?formatDateTime(t.fin):'En curso'}</td>
      <td>${t.horas?t.horas.toFixed(2):'0.00'}</td>
      <td><span class="badge" style="background:${col}">${t.estado.toUpperCase()}</span></td>
      <td class="actions">
        ${t.estado==='en_curso'&&t.empleadoId===currentUser.id?`<button class="btn btn-danger btn-sm" onclick="finalizarTurno(${t.id})"><i class="fas fa-stop"></i> Finalizar</button>`:''}
        ${t.estado==='pendiente'&&currentUser.role==='admin'?`<button class="btn btn-success btn-sm" onclick="aprobarTurno(${t.id})"><i class="fas fa-check"></i> Aprobar</button>`:''}
      </td>`;
    tbody.appendChild(row);
  });
}

function openTurnoModal() {
  const canchas = JSON.parse(localStorage.getItem('canchas') || '[]');
  const canchaAsignada = currentUser.role === 'empleado' ? canchas.find(c => c.id === currentUser.canchaAsignada) : null;
  const now = new Date().toISOString().slice(0,16);
  document.getElementById('modal-title').textContent = 'Registrar Turno';
  document.getElementById('modal-body').innerHTML = `
    <form id="form-turno">
      <div class="form-group"><label>Cancha</label>
        ${currentUser.role==='empleado'?`<input type="text" value="${canchaAsignada?canchaAsignada.nombre:'Sin cancha asignada'}" readonly style="background:#f5f5f5">`:`<select id="turno-cancha" required><option value="">-- Seleccionar --</option>${canchas.map(c=>`<option value="${c.id}">${c.nombre}</option>`).join('')}</select>`}
      </div>
      <div class="form-group"><label>Fecha y Hora de Inicio</label><input type="datetime-local" id="turno-inicio" value="${now}" required></div>
      <button type="submit" class="btn btn-primary"><i class="fas fa-play"></i> Iniciar Turno</button>
    </form>`;
  document.getElementById('form-turno').addEventListener('submit', e => { e.preventDefault(); registrarInicioTurno(); });
  openModal();
}

function registrarInicioTurno() {
  const turnos = JSON.parse(localStorage.getItem('turnos') || '[]');
  const newId = turnos.length > 0 ? Math.max(...turnos.map(t => t.id)) + 1 : 1;
  let canchaId = currentUser.role === 'empleado' ? currentUser.canchaAsignada : parseInt(document.getElementById('turno-cancha')?.value);
  if (!canchaId) { showNotification('Error','No hay cancha disponible','error'); return; }
  turnos.push({ id: newId, empleadoId: currentUser.id, canchaId, inicio: document.getElementById('turno-inicio').value, fin: null, horas: 0, estado: 'en_curso' });
  localStorage.setItem('turnos', JSON.stringify(turnos));
  showNotification('¡Éxito!','Turno iniciado','success'); closeModal(); loadTurnos();
}

function finalizarTurno(id) {
  if (!confirm('¿Finalizar turno?')) return;
  const turnos = JSON.parse(localStorage.getItem('turnos') || '[]');
  const t = turnos.find(x => x.id === id);
  if (t) { const fin=new Date().toISOString().slice(0,16); t.fin=fin; t.horas=(new Date(fin)-new Date(t.inicio))/3600000; t.estado='pendiente'; localStorage.setItem('turnos',JSON.stringify(turnos)); showNotification('¡Éxito!','Turno finalizado, pendiente de aprobación','success'); loadTurnos(); }
}

function aprobarTurno(id) {
  const turnos = JSON.parse(localStorage.getItem('turnos') || '[]');
  const t = turnos.find(x => x.id === id);
  if (t) { t.estado='aprobado'; localStorage.setItem('turnos',JSON.stringify(turnos)); showNotification('¡Aprobado!','Turno aprobado','success'); loadTurnos(); }
}

// ==========================================
// PAGOS
// ==========================================
function loadPagos() {
  const pagos = JSON.parse(localStorage.getItem('pagos') || '[]');
  const tbody = document.getElementById('pagos-tbody');
  tbody.innerHTML = '';
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  let lista = currentUser.role === 'empleado' ? pagos.filter(p => p.empleadoId === currentUser.id) : pagos;
  if (!lista.length) { tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--gray);padding:30px">No hay pagos registrados</td></tr>'; return; }
  lista.forEach(p => {
    const emp = usuarios.find(u => u.id === p.empleadoId);
    const avatarSrc = emp ? (emp.avatar||getAvatar(emp.nombre,emp.id)) : '';
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${p.id}</td>
      <td><div class="table-person">${emp?`<img src="${avatarSrc}" class="avatar-table" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(emp.nombre)}&background=2E7D32&color=fff&size=40'">`:''}<span>${emp?emp.nombre:'N/A'}</span></div></td>
      <td>${p.horas.toFixed(2)}</td>
      <td>$${Number(p.tarifaHora).toLocaleString('es-CO')}</td>
      <td>$${Number(p.total).toLocaleString('es-CO')} COP</td>
      <td><span class="badge" style="background:${p.estado==='pagado'?'var(--success)':'var(--warning)'}">${p.estado.toUpperCase()}</span></td>
      <td>${formatDate(p.fecha)}</td>`;
    tbody.appendChild(row);
  });
}

function procesarPagosPendientes() {
  const turnos = JSON.parse(localStorage.getItem('turnos') || '[]');
  const pagos = JSON.parse(localStorage.getItem('pagos') || '[]');
  const aprobados = turnos.filter(t => t.estado === 'aprobado');
  if (!aprobados.length) { showNotification('Info','No hay turnos aprobados pendientes de pago','info'); return; }
  const por = {};
  aprobados.forEach(t => { if (!por[t.empleadoId]) por[t.empleadoId] = { empleadoId: t.empleadoId, horas: 0 }; por[t.empleadoId].horas += t.horas; });
  let newId = pagos.length > 0 ? Math.max(...pagos.map(p => p.id)) + 1 : 1;
  Object.values(por).forEach(d => { pagos.push({ id: newId++, empleadoId: d.empleadoId, horas: d.horas, tarifaHora: TARIFA_HORA, total: d.horas * TARIFA_HORA, estado: 'pagado', fecha: new Date().toISOString() }); });
  aprobados.forEach(t => t.estado = 'pagado');
  localStorage.setItem('pagos', JSON.stringify(pagos)); localStorage.setItem('turnos', JSON.stringify(turnos));
  showNotification('¡Éxito!',`${Object.keys(por).length} pagos procesados`,'success'); loadPagos(); loadTurnos();
}

// ==========================================
// REPORTES
// ==========================================
function loadReportes() {
  document.getElementById('reporte-resultado').innerHTML = `<div class="reporte-vacio"><i class="fas fa-file-alt"></i><p>Selecciona los filtros y presiona "Filtrar" para generar el reporte</p></div>`;
}

function filtrarReporte() {
  const fi = document.getElementById('filter-fecha-inicio').value;
  const ff = document.getElementById('filter-fecha-fin').value;
  const tipo = document.getElementById('filter-tipo-reporte').value;
  if (!fi || !ff) { showNotification('Error','Selecciona ambas fechas','error'); return; }
  const ini = new Date(fi), fin = new Date(ff+'T23:59:59');
  let html = `<div style="padding:20px"><h3 style="margin-bottom:20px">Reporte ${formatDate(fi)} – ${formatDate(ff)}</h3>`;
  if (tipo==='todos'||tipo==='turnos') { const t=JSON.parse(localStorage.getItem('turnos')||'[]').filter(x=>new Date(x.inicio)>=ini&&new Date(x.inicio)<=fin); html+=`<h4 style="color:var(--primary);margin-top:20px">Turnos (${t.length})</h4><p>Horas totales: ${t.reduce((s,x)=>s+(x.horas||0),0).toFixed(2)} h</p>`; }
  if (tipo==='todos'||tipo==='pagos') { const p=JSON.parse(localStorage.getItem('pagos')||'[]').filter(x=>new Date(x.fecha)>=ini&&new Date(x.fecha)<=fin); html+=`<h4 style="color:var(--primary);margin-top:20px">Pagos (${p.length})</h4><p>Total: $${p.reduce((s,x)=>s+x.total,0).toLocaleString('es-CO')} COP</p>`; }
  if (tipo==='todos'||tipo==='canchas') { const canchas=JSON.parse(localStorage.getItem('canchas')||'[]'); const turnos=JSON.parse(localStorage.getItem('turnos')||'[]'); html+=`<h4 style="color:var(--primary);margin-top:20px">Uso de Canchas</h4>`; canchas.forEach(c=>{const u=turnos.filter(t=>t.canchaId===c.id&&new Date(t.inicio)>=ini&&new Date(t.inicio)<=fin); html+=`<p>${c.nombre}: ${u.length} turnos</p>`;}); }
  html += '</div>';
  document.getElementById('reporte-resultado').innerHTML = html;
  showNotification('¡Listo!','Reporte generado','success');
}

function exportarReporte() {
  const c = document.getElementById('reporte-resultado').innerHTML;
  if (!c||c.includes('reporte-vacio')) { showNotification('Error','Genera el reporte primero','error'); return; }
  const w = window.open('','_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>Reporte Club Tenis Colombia</title><style>body{font-family:Arial,sans-serif;padding:20px}h3,h4{color:#2E7D32}p{margin:10px 0}</style></head><body>${c}<script>window.print()<\/script></body></html>`);
}

// ==========================================
// PERFIL
// ==========================================
function loadPerfil() {
  if (!currentUser) return;
  document.getElementById('profile-nombre').textContent = currentUser.nombre;
  document.getElementById('profile-role').textContent = currentUser.role === 'admin' ? 'Administrador' : 'Empleado';
  document.getElementById('perfil-nombre').value = currentUser.nombre;
  document.getElementById('perfil-username').value = currentUser.username;
  const pa = document.getElementById('profile-avatar-img');
  if (pa) {
    pa.src = currentUser.avatar || getAvatar(currentUser.nombre, currentUser.id);
    pa.onerror = () => { pa.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.nombre)}&background=2E7D32&color=fff&size=120`; };
  }
}

function guardarPerfilInfo(e) {
  e.preventDefault();
  const nombre = document.getElementById('perfil-nombre').value.trim();
  if (!nombre) { showNotification('Error','Nombre requerido','error'); return; }
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const u = usuarios.find(x => x.id === currentUser.id);
  if (u) { u.nombre = nombre; currentUser.nombre = nombre; localStorage.setItem('usuarios', JSON.stringify(usuarios)); localStorage.setItem('currentSession', JSON.stringify(currentUser)); document.getElementById('user-name').textContent = nombre; document.getElementById('profile-nombre').textContent = nombre; showNotification('¡Éxito!','Perfil actualizado','success'); }
}

function cambiarPassword(e) {
  e.preventDefault();
  const actual = document.getElementById('password-actual').value;
  const nueva = document.getElementById('password-nueva').value;
  const conf = document.getElementById('password-confirmar').value;
  if (actual !== currentUser.password) { showNotification('Error','Contraseña actual incorrecta','error'); return; }
  if (nueva.length < 6) { showNotification('Error','Mínimo 6 caracteres','error'); return; }
  if (nueva !== conf) { showNotification('Error','Las contraseñas no coinciden','error'); return; }
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const u = usuarios.find(x => x.id === currentUser.id);
  if (u) { u.password=nueva; currentUser.password=nueva; localStorage.setItem('usuarios',JSON.stringify(usuarios)); localStorage.setItem('currentSession',JSON.stringify(currentUser)); document.getElementById('form-cambiar-password').reset(); showNotification('¡Éxito!','Contraseña cambiada','success'); }
}

// ==========================================
// MODAL / NOTIFICACIONES / FAQ / UTILS
// ==========================================
function openModal() { document.getElementById('modal').classList.add('active'); }
function closeModal() { document.getElementById('modal').classList.remove('active'); }

function showNotification(title, message, type = 'info') {
  const container = document.getElementById('notifications-container');
  const n = document.createElement('div');
  n.className = `notification ${type}`;
  const icons = { success:'fa-check-circle', error:'fa-exclamation-circle', warning:'fa-exclamation-triangle', info:'fa-info-circle' };
  n.innerHTML = `<i class="fas ${icons[type]||icons.info}"></i><div class="notification-content"><h4>${title}</h4><p>${message}</p></div>`;
  container.appendChild(n);
  setTimeout(() => { n.style.transition='all 0.3s ease'; n.style.opacity='0'; n.style.transform='translateX(100%)'; setTimeout(()=>n.remove(),300); }, 4000);
}

function setupFAQToggles() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', function() {
      const item = this.closest('.faq-item');
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });
}

function formatDateTime(dt) {
  if (!dt) return 'N/A';
  const d = new Date(dt); const p = n => String(n).padStart(2,'0');
  return `${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function formatDate(d) {
  if (!d) return 'N/A';
  const x = new Date(d); const p = n => String(n).padStart(2,'0');
  return `${p(x.getDate())}/${p(x.getMonth()+1)}/${x.getFullYear()}`;
}
