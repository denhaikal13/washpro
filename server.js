import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

// Gunakan folder /tmp jika berjalan di Vercel agar bisa menyimpan data sementara
const isVercel = process.env.VERCEL === '1';
const DATA_FILE = isVercel 
  ? path.join('/tmp', 'data.json') 
  : path.join(__dirname, 'data.json');

// Initial Seed Data
const initialData = {
  services: [
    { id: 'srv-1', name: 'Kiloan Reguler (Cuci + Setrika)', category: 'kiloan', price: 8000, unit: 'Kg', durationHours: 48, description: 'Layanan standar 2 hari selesai, harum dan rapi.' },
    { id: 'srv-2', name: 'Kiloan Express 24 Jam', category: 'kiloan', price: 13000, unit: 'Kg', durationHours: 24, description: 'Prioritas selesai dalam 1x24 jam.' },
    { id: 'srv-3', name: 'Kiloan Kilat 6 Jam', category: 'kiloan', price: 20000, unit: 'Kg', durationHours: 6, description: 'Selesai di hari yang sama, cuci kering setrika kilat.' },
    { id: 'srv-4', name: 'Cuci Setrika Bedcover Besar', category: 'satuan', price: 35000, unit: 'Pcs', durationHours: 48, description: 'Pembersihan mendalam untuk selimut & bedcover tebal.' },
    { id: 'srv-5', name: 'Setrika Kiloan Saja', category: 'kiloan', price: 5000, unit: 'Kg', durationHours: 24, description: 'Pakaian sudah dicuci dari rumah, disetrika uap rapi.' },
    { id: 'srv-6', name: 'Jas / Safari / Gaun Satuan', category: 'satuan', price: 25000, unit: 'Pcs', durationHours: 48, description: 'Perawatan khusus bahan wol, jas, dan gaun sensitif.' }
  ],
  couriers: [
    { id: 'dr-1', name: 'Budi Santoso', phone: '081288991001', vehicle: 'Honda Vario (B 4521 ABC)', active: true, area: 'Jakarta Selatan' },
    { id: 'dr-2', name: 'Dimas Pratama', phone: '081377223344', vehicle: 'Honda Beat (B 6789 DEF)', active: true, area: 'Kebayoran Baru' }
  ],
  racks: ['Rak A-01', 'Rak A-02', 'Rak A-03', 'Rak B-01', 'Rak B-02', 'Rak B-03', 'Rak C-01', 'Rak C-02'],
  orders: [
    {
      id: 'ord-101',
      orderNumber: 'WP-202611-001',
      customerName: 'Bpk. Hendra Wijaya',
      customerPhone: '081234567890',
      address: 'Jl. Senopati No. 12, Kebayoran Baru, Jakarta Selatan',
      scheduledPickup: '2026-11-12T09:00:00',
      serviceId: 'srv-1',
      serviceName: 'Kiloan Reguler (Cuci + Setrika)',
      status: 'pickup_scheduled',
      notes: 'Tolong jangan campur kemeja putih dengan baju berwarna.',
      estimatedWeight: null,
      actualWeight: 0,
      totalAmount: 0,
      paymentMethod: 'qris',
      paymentStatus: 'unpaid',
      rackNumber: '',
      courierId: 'dr-1',
      courierName: 'Budi Santoso',
      pickupPhoto: null,
      deliveryProofPhoto: null,
      deliverySignature: null,
      createdAt: '2026-11-12T07:30:00.000Z'
    },
    {
      id: 'ord-102',
      orderNumber: 'WP-202611-002',
      customerName: 'Ibu Anita Kusuma',
      customerPhone: '081399887766',
      address: 'Jl. Gandaria Tengah II No. 8, Jakarta Selatan',
      scheduledPickup: '2026-11-12T08:00:00',
      serviceId: 'srv-2',
      serviceName: 'Kiloan Express 24 Jam',
      status: 'picked_up',
      notes: 'Baju kerja penting, tolong setrika ekstra licin.',
      estimatedWeight: '4-5 kg (1 kantong besar)',
      actualWeight: 0,
      totalAmount: 0,
      paymentMethod: 'cash',
      paymentStatus: 'unpaid',
      rackNumber: '',
      courierId: 'dr-1',
      courierName: 'Budi Santoso',
      pickupPhoto: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=400&q=80',
      deliveryProofPhoto: null,
      deliverySignature: null,
      createdAt: '2026-11-12T06:15:00.000Z'
    },
    {
      id: 'ord-103',
      orderNumber: 'WP-202611-003',
      customerName: 'Mas Rizky Pratama',
      customerPhone: '085711223344',
      address: 'Jl. Panglima Polim IV No. 15, Melawai',
      scheduledPickup: '2026-11-11T14:00:00',
      serviceId: 'srv-2',
      serviceName: 'Kiloan Express 24 Jam',
      status: 'washing',
      notes: 'Gunakan detergen hypoallergenic jika ada.',
      estimatedWeight: '5 kg',
      actualWeight: 5.4,
      totalAmount: 70200,
      paymentMethod: 'qris',
      paymentStatus: 'paid',
      rackNumber: '',
      courierId: 'dr-2',
      courierName: 'Dimas Pratama',
      pickupPhoto: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=400&q=80',
      deliveryProofPhoto: null,
      deliverySignature: null,
      createdAt: '2026-11-11T13:45:00.000Z'
    },
    {
      id: 'ord-104',
      orderNumber: 'WP-202611-004',
      customerName: 'Mbak Citra Lestari',
      customerPhone: '081822334455',
      address: 'Jl. Wijaya I No. 20, Kebayoran Baru',
      scheduledPickup: '2026-11-10T10:00:00',
      serviceId: 'srv-1',
      serviceName: 'Kiloan Reguler (Cuci + Setrika)',
      status: 'ready_delivery',
      notes: 'Gantungan baju sudah saya siapkan 5 buah.',
      estimatedWeight: '3.5 kg',
      actualWeight: 3.8,
      totalAmount: 30400,
      paymentMethod: 'qris',
      paymentStatus: 'paid',
      rackNumber: 'Rak A-02',
      courierId: 'dr-2',
      courierName: 'Dimas Pratama',
      pickupPhoto: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=400&q=80',
      deliveryProofPhoto: null,
      deliverySignature: null,
      createdAt: '2026-11-10T09:30:00.000Z'
    },
    {
      id: 'ord-105',
      orderNumber: 'WP-202611-005',
      customerName: 'Bpk. Doni Firmansyah',
      customerPhone: '081299001122',
      address: 'Jl. Radio Dalam Raya No. 5, Gandaria',
      scheduledPickup: '2026-11-09T11:00:00',
      serviceId: 'srv-4',
      serviceName: 'Cuci Setrika Bedcover Besar',
      status: 'completed',
      notes: 'Packing plastik rapat anti hujan.',
      estimatedWeight: '1 Pcs',
      actualWeight: 1,
      totalAmount: 35000,
      paymentMethod: 'cash',
      paymentStatus: 'paid',
      rackNumber: 'Rak C-01',
      courierId: 'dr-1',
      courierName: 'Budi Santoso',
      pickupPhoto: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=400&q=80',
      deliveryProofPhoto: 'https://images.unsplash.com/photo-1521656693074-0ef32e80a5d5?auto=format&fit=crop&w=400&q=80',
      deliverySignature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><path d="M10 25 Q 30 10, 50 25 T 90 20" fill="none" stroke="black" stroke-width="2"/></svg>',
      createdAt: '2026-11-09T10:15:00.000Z'
    }
  ]
};

// Load or initialize DB
function getDB() {
  if (!fs.existsSync(DATA_FILE)) {
    const localSeedFile = path.join(__dirname, 'data.json');
    if (isVercel && fs.existsSync(localSeedFile)) {
      try {
        const seedRaw = fs.readFileSync(localSeedFile, 'utf8');
        saveDB(JSON.parse(seedRaw));
        return JSON.parse(seedRaw);
      } catch (e) {}
    }
    saveDB(initialData);
    return JSON.parse(JSON.stringify(initialData));
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    saveDB(initialData);
    return JSON.parse(JSON.stringify(initialData));
  }
}

function saveDB(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Gagal menyimpan DB:', err);
  }
}

// Helpers
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Server Handler
const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;

  // 1. API ROUTES
  if (pathname.startsWith('/api/')) {
    const db = getDB();

    if (pathname === '/api/orders' && req.method === 'GET') {
      return sendJSON(res, 200, { success: true, data: db.orders });
    }

    if (pathname === '/api/orders' && req.method === 'POST') {
      try {
        const body = await parseBody(req);
        const orderCount = db.orders.length + 1;
        const padCount = String(orderCount).padStart(3, '0');
        const orderNumber = `WP-${new Date().toISOString().slice(0, 7).replace('-', '')}-${padCount}`;
        const srv = db.services.find(s => s.id === body.serviceId) || db.services[0];

        const newOrder = {
          id: `ord-${Date.now()}`,
          orderNumber: orderNumber,
          customerName: body.customerName || 'Pelanggan WashPro',
          customerPhone: body.customerPhone || '081234567890',
          address: body.address || 'Alamat Penjemputan',
          scheduledPickup: body.scheduledPickup || new Date().toISOString(),
          serviceId: srv.id,
          serviceName: srv.name,
          status: 'pickup_scheduled',
          notes: body.notes || '-',
          estimatedWeight: body.estimatedWeight || 'Taksiran 3-5 kg',
          actualWeight: 0,
          totalAmount: 0,
          paymentMethod: body.paymentMethod || 'qris',
          paymentStatus: 'unpaid',
          rackNumber: '',
          courierId: body.courierId || (db.couriers[0] ? db.couriers[0].id : null),
          courierName: body.courierId ? (db.couriers.find(c => c.id === body.courierId)?.name || 'Kurir WashPro') : (db.couriers[0]?.name || 'Kurir WashPro'),
          pickupPhoto: null,
          deliveryProofPhoto: null,
          deliverySignature: null,
          createdAt: new Date().toISOString()
        };

        db.orders.unshift(newOrder);
        saveDB(db);
        return sendJSON(res, 201, { success: true, message: 'Pesanan penjemputan berhasil dibuat!', data: newOrder });
      } catch (err) {
        return sendJSON(res, 400, { success: false, error: err.message });
      }
    }

    if (pathname.startsWith('/api/orders/') && req.method === 'PATCH') {
      const orderId = pathname.replace('/api/orders/', '');
      const idx = db.orders.findIndex(o => o.id === orderId);
      if (idx === -1) {
        return sendJSON(res, 404, { success: false, error: 'Pesanan tidak ditemukan' });
      }

      try {
        const body = await parseBody(req);
        const order = db.orders[idx];

        if (body.actualWeight !== undefined) {
          order.actualWeight = parseFloat(body.actualWeight) || 0;
          const srv = db.services.find(s => s.id === order.serviceId);
          const price = srv ? srv.price : 8000;
          order.totalAmount = Math.round(order.actualWeight * price);
        }

        if (body.status !== undefined) order.status = body.status;
        if (body.rackNumber !== undefined) order.rackNumber = body.rackNumber;
        if (body.paymentStatus !== undefined) order.paymentStatus = body.paymentStatus;
        if (body.paymentMethod !== undefined) order.paymentMethod = body.paymentMethod;
        if (body.courierId !== undefined) {
          order.courierId = body.courierId;
          const c = db.couriers.find(cr => cr.id === body.courierId);
          if (c) order.courierName = c.name;
        }
        if (body.pickupPhoto !== undefined) order.pickupPhoto = body.pickupPhoto;
        if (body.deliveryProofPhoto !== undefined) order.deliveryProofPhoto = body.deliveryProofPhoto;
        if (body.deliverySignature !== undefined) order.deliverySignature = body.deliverySignature;
        if (body.notes !== undefined) order.notes = body.notes;

        db.orders[idx] = order;
        saveDB(db);
        return sendJSON(res, 200, { success: true, message: 'Data pesanan berhasil diperbarui', data: order });
      } catch (err) {
        return sendJSON(res, 400, { success: false, error: err.message });
      }
    }

    if (pathname === '/api/services' && req.method === 'GET') {
      return sendJSON(res, 200, { success: true, data: db.services });
    }

    if (pathname === '/api/couriers' && req.method === 'GET') {
      return sendJSON(res, 200, { success: true, data: db.couriers });
    }

    if (pathname === '/api/racks' && req.method === 'GET') {
      return sendJSON(res, 200, { success: true, data: db.racks });
    }

    if (pathname === '/api/stats' && req.method === 'GET') {
      const totalRevenue = db.orders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const totalKg = db.orders
        .reduce((sum, o) => sum + (o.actualWeight || 0), 0);
      const activeOrders = db.orders
        .filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;
      const completedOrders = db.orders
        .filter(o => o.status === 'completed').length;

      return sendJSON(res, 200, {
        success: true,
        data: {
          totalRevenue,
          totalKg: Math.round(totalKg * 10) / 10,
          activeOrders,
          completedOrders,
          totalOrders: db.orders.length,
          activeCouriers: db.couriers.filter(c => c.active).length
        }
      });
    }

    if (pathname === '/api/reset' && req.method === 'POST') {
      saveDB(initialData);
      return sendJSON(res, 200, { success: true, message: 'Data demo berhasil di-reset!', data: initialData });
    }

    return sendJSON(res, 404, { success: false, error: 'Endpoint API tidak ditemukan' });
  }

  // 2. STATIC FILES SERVING (PUBLIC FOLDER)
  let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err2, fallbackContent) => {
          if (err2) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(fallbackContent, 'utf-8');
          }
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

getDB();

// Jalankan server.listen hanya jika bukan di Vercel
if (!isVercel) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🚀 WashPro Server berjalan di http://localhost:${PORT}`);
    console.log(`📦 Sistem Manajemen Laundry & Kurir Terintegrasi Aktif`);
    console.log(`=======================================================`);
  });
}

// Wajib di-export agar Vercel bisa menjalankan server HTTP ini
export default server;