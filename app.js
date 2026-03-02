// Database
const db = {
  init() {
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([{
        id: 'admin_1', email: 'joshualee2541@gmail.com', password: 'joker2541',
        name: 'Joshua Lee', role: 'ADMIN', isActive: true, createdAt: new Date().toISOString()
      }]));
      localStorage.setItem('orders', '[]');
      localStorage.setItem('messages', '[]');
    }
  },
  getUsers() { return JSON.parse(localStorage.getItem('users') || '[]'); },
  saveUsers(u) { localStorage.setItem('users', JSON.stringify(u)); },
  getOrders() { return JSON.parse(localStorage.getItem('orders') || '[]'); },
  saveOrders(o) { localStorage.setItem('orders', JSON.stringify(o)); },
  getMessages() { return JSON.parse(localStorage.getItem('messages') || '[]'); },
  saveMessages(m) { localStorage.setItem('messages', JSON.stringify(m)); }
};

// Auth
const auth = {
  currentUser: null,
  init() {
    const saved = sessionStorage.getItem('session');
    if (saved) this.currentUser = JSON.parse(saved);
    this.updateNav();
  },
  login(email, password) {
    const user = db.getUsers().find(u => u.email === email.toLowerCase() && u.password === password && u.isActive);
    if (!user) return { error: 'Invalid email or password' };
    this.currentUser = { id: user.id, email: user.email, name: user.name, role: user.role };
    sessionStorage.setItem('session', JSON.stringify(this.currentUser));
    this.updateNav();
    return { success: true };
  },
  signup(data) {
    const users = db.getUsers();
    if (users.find(u => u.email === data.email.toLowerCase())) return { error: 'Email already registered' };
    const newUser = {
      id: 'user_' + Date.now(), email: data.email.toLowerCase(), password: data.password,
      name: data.name, phone: data.phone || '', role: 'CUSTOMER', isActive: true, createdAt: new Date().toISOString()
    };
    users.push(newUser);
    db.saveUsers(users);
    this.currentUser = { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role };
    sessionStorage.setItem('session', JSON.stringify(this.currentUser));
    this.updateNav();
    return { success: true };
  },
  logout() {
    this.currentUser = null;
    sessionStorage.removeItem('session');
    this.updateNav();
    showPage('home');
  },
  updateNav() {
    const nav = document.getElementById('authLinks');
    if (this.currentUser) {
      const link = this.currentUser.role === 'ADMIN' ? 'admin' : 'dashboard';
      nav.innerHTML = `<span onclick="showPage('${link}')">${this.currentUser.role === 'ADMIN' ? 'Admin' : 'Dashboard'}</span>
        <span onclick="auth.logout()" class="btn btn-outline" style="padding:0.25rem 0.75rem;">Logout</span>`;
    } else {
      nav.innerHTML = `<span onclick="showPage('login')" class="btn btn-primary" style="padding:0.25rem 0.75rem;">Login</span>`;
    }
  }
};

// Pages
const pages = {
  home: () => `
    <div class="hero"><div class="container">
      <h1>Secure. Build. Verify.</h1>
      <p>Your trusted technology partner in Kenya.</p>
      <button onclick="showPage('services')" class="btn btn-primary btn-lg">Explore Services</button>
    </div></div>
    <div class="container"><div class="grid">
      <div class="card"><h3>🔵 Meta Verification</h3><p>Get verified on Facebook and Instagram.</p><button onclick="showPage('services')" class="btn btn-secondary">Learn More</button></div>
      <div class="card"><h3>💻 Web Development</h3><p>Custom websites built with modern tech.</p><button onclick="showPage('services')" class="btn btn-secondary">Learn More</button></div>
      <div class="card"><h3>📱 App Development</h3><p>Native iOS and Android apps.</p><button onclick="showPage('services')" class="btn btn-secondary">Learn More</button></div>
      <div class="card"><h3>🔒 Cybersecurity</h3><p>Protect your business.</p><button onclick="showPage('services')" class="btn btn-secondary">Learn More</button></div>
    </div></div>`,
  
  about: () => `
    <div class="container" style="padding:4rem 0;">
      <h1 style="text-align:center;margin-bottom:2rem;color:#00D4FF;">About Us</h1>
      <div class="card" style="max-width:800px;margin:0 auto;">
        <h3>Our Story</h3>
        <p style="color:#b0c4de;margin-bottom:1rem;">LEE TECHNOLOGIES began in Kisii, Kenya. We provide premium tech services to businesses across Africa.</p>
        <h3>Contact</h3>
        <p style="color:#b0c4de;">Email: joshualee2541@gmail.com<br>Phone: +254 729 683 696<br>Location: Kisii, Kenya</p>
      </div>
    </div>`,
  
  services: () => `
    <div class="container" style="padding:4rem 0;">
      <h1 style="text-align:center;margin-bottom:3rem;color:#00D4FF;">Our Services</h1>
      <div class="grid">
        <div class="card"><h3>🔵 Meta Verification</h3><p style="color:#b0c4de;">Facebook & Instagram verification.</p><p style="color:#FFD700;font-weight:bold;">From KES 15,000</p>${auth.currentUser ? '<button onclick="showPage(\'order\')" class="btn btn-primary">Order Now</button>' : '<button onclick="showPage(\'login\')" class="btn btn-primary">Login to Order</button>'}</div>
        <div class="card"><h3>💻 Web Development</h3><p style="color:#b0c4de;">Custom websites & web apps.</p><p style="color:#FFD700;font-weight:bold;">From KES 25,000</p>${auth.currentUser ? '<button onclick="showPage(\'order\')" class="btn btn-primary">Order Now</button>' : '<button onclick="showPage(\'login\')" class="btn btn-primary">Login to Order</button>'}</div>
        <div class="card"><h3>📱 App Development</h3><p style="color:#b0c4de;">iOS & Android apps.</p><p style="color:#FFD700;font-weight:bold;">From KES 80,000</p>${auth.currentUser ? '<button onclick="showPage(\'order\')" class="btn btn-primary">Order Now</button>' : '<button onclick="showPage(\'login\')" class="btn btn-primary">Login to Order</button>'}</div>
        <div class="card"><h3>🔒 Cybersecurity</h3><p style="color:#b0c4de;">Security audits & testing.</p><p style="color:#FFD700;font-weight:bold;">From KES 30,000</p>${auth.currentUser ? '<button onclick="showPage(\'order\')" class="btn btn-primary">Order Now</button>' : '<button onclick="showPage(\'login\')" class="btn btn-primary">Login to Order</button>'}</div>
      </div>
    </div>`,
  
  contact: () => `
    <div class="container" style="padding:4rem 0;">
      <h1 style="text-align:center;margin-bottom:3rem;color:#00D4FF;">Contact Us</h1>
      <div style="max-width:600px;margin:0 auto;">
        <div class="card" style="margin-bottom:2rem;">
          <h3>Get In Touch</h3>
          <p style="color:#b0c4de;">
            <strong>Email:</strong> joshualee2541@gmail.com<br>
            <strong>Phone/WhatsApp:</strong> +254 729 683 696<br>
            <strong>Address:</strong> Kisii, Kenya
          </p>
        </div>
        <div class="card">
          <h3>Send Message</h3>
          <form onsubmit="event.preventDefault();alert('Message sent!');this.reset();">
            <div class="form-group"><label>Name</label><input type="text" required></div>
            <div class="form-group"><label>Email</label><input type="email" required></div>
            <div class="form-group"><label>Message</label><textarea rows="4" required></textarea></div>
            <button type="submit" class="btn btn-primary" style="width:100%;">Send</button>
          </form>
        </div>
      </div>
    </div>`,
  
  login: (error = '') => `
    <div class="login-container">
      <div class="login-box">
        <div class="login-header"><h2>Welcome Back</h2><p style="color:#b0c4de;">Sign in to your account</p></div>
        ${error ? `<div class="error">${error}</div>` : ''}
        <form onsubmit="handleLogin(event)" class="card">
          <div class="form-group"><label>Email</label><input type="email" id="loginEmail" required placeholder="you@example.com"></div>
          <div class="form-group"><label>Password</label><input type="password" id="loginPassword" required placeholder="••••••••"></div>
          <button type="submit" class="btn btn-primary" style="width:100%;">Sign In</button>
        </form>
        <p style="text-align:center;margin-top:1.5rem;color:#b0c4de;">Don't have an account? <span onclick="showPage('signup')" style="color:#00D4FF;cursor:pointer;">Sign up</span></p>
      </div>
    </div>`,
  
  signup: (error = '') => `
    <div class="login-container">
      <div class="login-box">
        <div class="login-header"><h2>Create Account</h2><p style="color:#b0c4de;">Join LEE TECHNOLOGIES</p></div>
        ${error ? `<div class="error">${error}</div>` : ''}
        <form onsubmit="handleSignup(event)" class="card">
          <div class="form-group"><label>Full Name *</label><input type="text" id="signupName" required></div>
          <div class="form-group"><label>Email *</label><input type="email" id="signupEmail" required></div>
          <div class="form-group"><label>Phone</label><input type="tel" id="signupPhone"></div>
          <div class="form-group"><label>Password *</label><input type="password" id="signupPassword" required minlength="8"></div>
          <div class="form-group"><label>Confirm Password *</label><input type="password" id="signupConfirm" required></div>
          <button type="submit" class="btn btn-primary" style="width:100%;">Create Account</button>
        </form>
        <p style="text-align:center;margin-top:1.5rem;color:#b0c4de;">Already have an account? <span onclick="showPage('login')" style="color:#00D4FF;cursor:pointer;">Sign in</span></p>
      </div>
    </div>`,
  
  dashboard: () => {
    const orders = db.getOrders().filter(o => o.userId === auth.currentUser.id);
    return `
      <div class="container" style="padding:2rem 0;">
        <h2 style="margin-bottom:2rem;">Welcome, ${auth.currentUser.name || auth.currentUser.email}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.5rem;margin-bottom:2rem;">
          <div onclick="showPage('order')" class="card" style="text-align:center;cursor:pointer;background:linear-gradient(135deg,#FFD700,#ffc700);color:#0A1628;"><div style="font-size:2.5rem;">➕</div><h3>New Order</h3></div>
          <div onclick="showPage('myorders')" class="card" style="text-align:center;cursor:pointer;"><div style="font-size:2.5rem;color:#00D4FF;">📋</div><h3>My Orders</h3></div>
        </div>
        <h3 style="margin-bottom:1rem;color:#00D4FF;">Recent Orders</h3>
        ${orders.length === 0 ? '<div class="card" style="text-align:center;color:#b0c4de;">No orders yet.</div>' : 
          `<div class="card" style="padding:0;overflow:hidden;"><table><thead><tr><th>Service</th><th>Status</th><th>Date</th></tr></thead><tbody>
            ${orders.map(o => `<tr><td>${o.service}</td><td><span class="badge badge-${o.status.toLowerCase()}">${o.status}</span></td><td style="color:#b0c4de;">${new Date(o.date).toLocaleDateString()}</td></tr>`).join('')}
          </tbody></table></div>`}
      </div>`;
  },
  
  order: () => `
    <div class="container" style="max-width:600px;padding:2rem 0;">
      <h2>New Order</h2>
      <form onsubmit="handleOrder(event)" class="card">
        <div class="form-group"><label>Service *</label><select id="orderService" required><option value="">Select...</option><option value="Meta Verification">Meta Verification</option><option value="Web Development">Web Development</option><option value="App Development">App Development</option><option value="Cybersecurity">Cybersecurity</option></select></div>
        <div class="form-group"><label>Description *</label><textarea id="orderDesc" rows="4" required></textarea></div>
        <div class="form-group"><label>Budget (KES)</label><input type="number" id="orderBudget"></div>
        <div style="display:flex;gap:1rem;"><button type="submit" class="btn btn-primary" style="flex:1;">Submit</button><button type="button" onclick="showPage('dashboard')" class="btn btn-outline" style="flex:1;">Cancel</button></div>
      </form>
    </div>`,
  
  myorders: () => {
    const orders = db.getOrders().filter(o => o.userId === auth.currentUser.id);
    return `
      <div class="container" style="padding:2rem 0;">
        <h2 style="margin-bottom:2rem;">My Orders</h2>
        ${orders.length === 0 ? '<div class="card" style="text-align:center;"><p style="color:#b0c4de;">No orders yet.</p></div>' : 
          `<div class="card" style="padding:0;overflow:hidden;"><table><thead><tr><th>ID</th><th>Service</th><th>Status</th><th>Date</th></tr></thead><tbody>
            ${orders.map(o => `<tr><td style="color:#00D4FF;">#${o.id.slice(-6)}</td><td>${o.service}</td><td><span class="badge badge-${o.status.toLowerCase()}">${o.status}</span></td><td style="color:#b0c4de;">${new Date(o.date).toLocaleDateString()}</td></tr>`).join('')}
          </tbody></table></div>`}
      </div>`;
  },
  
  admin: () => {
    const users = db.getUsers().filter(u => u.role === 'CUSTOMER');
    const orders = db.getOrders();
    return `
      <div class="admin-layout">
        <aside class="sidebar">
          <a onclick="showPage('admin')" class="active">📊 Dashboard</a>
          <a onclick="showPage('adminusers')">👥 Users</a>
          <a onclick="showPage('adminorders')">📦 Orders</a>
          <a onclick="showPage('home')">🏠 View Site</a>
        </aside>
        <main class="main-content">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;">
            <h2>Admin Dashboard</h2><span style="background:#FFD700;color:#0A1628;padding:0.25rem 0.75rem;border-radius:5px;font-weight:bold;">ADMIN</span>
          </div>
          <div class="stats-grid">
            <div class="stat-card"><h3>Customers</h3><div class="number">${users.length}</div></div>
            <div class="stat-card"><h3>Orders</h3><div class="number" style="color:#00D4FF;">${orders.length}</div></div>
            <div class="stat-card"><h3>Pending</h3><div class="number" style="color:#ff9800;">${orders.filter(o => o.status === 'PENDING').length}</div></div>
          </div>
        </main>
      </div>`;
  },
  
  adminusers: () => {
    const users = db.getUsers().filter(u => u.role === 'CUSTOMER');
    return `
      <div class="admin-layout">
        <aside class="sidebar">
          <a onclick="showPage('admin')">📊 Dashboard</a>
          <a onclick="showPage('adminusers')" class="active">👥 Users</a>
          <a onclick="showPage('adminorders')">📦 Orders</a>
          <a onclick="showPage('home')">🏠 View Site</a>
        </aside>
        <main class="main-content">
          <h2 style="margin-bottom:2rem;">Users</h2>
          <div class="card" style="padding:0;overflow:hidden;">
            <table><thead><tr><th>Name</th><th>Email</th><th>Status</th></tr></thead><tbody>
              ${users.map(u => `<tr><td>${u.name || 'N/A'}</td><td style="color:#b0c4de;">${u.email}</td><td>${u.isActive ? 'Active' : 'Inactive'}</td></tr>`).join('')}
            </tbody></table>
          </div>
        </main>
      </div>`;
  },
  
  adminorders: () => {
    const orders = db.getOrders();
    return `
      <div class="admin-layout">
        <aside class="sidebar">
          <a onclick="showPage('admin')">📊 Dashboard</a>
          <a onclick="showPage('adminusers')">👥 Users</a>
          <a onclick="showPage('adminorders')" class="active">📦 Orders</a>
          <a onclick="showPage('home')">🏠 View Site</a>
        </aside>
        <main class="main-content">
          <h2 style="margin-bottom:2rem;">Orders</h2>
          <div class="card" style="padding:0;overflow:hidden;">
            <table><thead><tr><th>ID</th><th>Customer</th><th>Service</th><th>Status</th></tr></thead><tbody>
              ${orders.map(o => {
                const u = db.getUsers().find(x => x.id === o.userId);
                return `<tr><td style="color:#00D4FF;">#${o.id.slice(-6)}</td><td>${u?.name || 'N/A'}</td><td>${o.service}</td><td><span class="badge badge-${o.status.toLowerCase()}">${o.status}</span></td></tr>`;
              }).join('')}
            </tbody></table>
          </div>
        </main>
      </div>`;
  }
};

// Functions
function showPage(page, error = '') {
  if ((page === 'dashboard' || page === 'order' || page === 'myorders') && !auth.currentUser) { showPage('login'); return; }
  if (page === 'admin' && (!auth.currentUser || auth.currentUser.role !== 'ADMIN')) { showPage('login'); return; }
  document.getElementById('app').innerHTML = pages[page](error);
  window.scrollTo(0, 0);
}

function handleLogin(e) {
  e.preventDefault();
  const result = auth.login(document.getElementById('loginEmail').value, document.getElementById('loginPassword').value);
  if (result.error) showPage('login', result.error);
  else showPage(auth.currentUser.role === 'ADMIN' ? 'admin' : 'dashboard');
}

function handleSignup(e) {
  e.preventDefault();
  if (document.getElementById('signupPassword').value !== document.getElementById('signupConfirm').value) {
    showPage('signup', 'Passwords do not match'); return;
  }
  const result = auth.signup({
    name: document.getElementById('signupName').value,
    email: document.getElementById('signupEmail').value,
    phone: document.getElementById('signupPhone').value,
    password: document.getElementById('signupPassword').value
  });
  if (result.error) showPage('signup', result.error);
  else showPage('dashboard');
}

function handleOrder(e) {
  e.preventDefault();
  const orders = db.getOrders();
  orders.push({
    id: 'ord_' + Date.now(),
    userId: auth.currentUser.id,
    service: document.getElementById('orderService').value,
    desc: document.getElementById('orderDesc').value,
    budget: document.getElementById('orderBudget').value,
    status: 'PENDING',
    date: new Date().toISOString()
  });
  db.saveOrders(orders);
  alert('Order submitted!');
  showPage('dashboard');
}

// Init
db.init();
auth.init();
showPage('home');
