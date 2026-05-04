# 💳 Paycore Wallet Console

Interfaz web de una plataforma tipo PSP (Payment Service Provider) para gestión de transferencias, monitoreo y analytics en tiempo real.

---

## 🚀 Demo

👉 https://paycore-wallet-console.vercel.app

---

## 🧠 Descripción

Paycore Wallet Console es una aplicación frontend desarrollada en React que consume una API backend para simular un sistema financiero moderno.

Permite visualizar métricas, gestionar transferencias, monitorear alertas y analizar comportamiento operativo.

---

## ✨ Features

### 🔐 Autenticación

* Login con JWT
* Persistencia de sesión
* Manejo de errores de autenticación

---

### 💸 Transferencias

* Listado de transferencias con paginación backend
* Creación de transferencias
* Estados:

  * Pendiente
  * Completada
  * Fallida
* Filtros por estado
* Búsqueda por ID / descripción
* Modal de detalle

---

### 📊 Dashboard

* Métricas principales:

  * Total de transferencias
  * Volumen operado
  * Tasa de éxito / fallo
* Gráficos:

  * Pie charts
  * Bar charts
  * Line chart (timeline)
* Dual axis en timeline (cantidad + volumen)

---

### 🚨 Alertas

* Alertas operativas
* Smart alerts (insights)
* Auto-refresh cada 10s
* Toast notifications en nuevas alertas
* Visualización de detalles técnicos

---

### 🎨 UX / UI

* Skeleton loading (dashboard, transfers, alerts)
* Persistencia de página en URL (`?page=2`)
* Navegación con sidebar activo
* Responsive design
* Feedback visual de estados

---

## 🧱 Stack Tecnológico

### Frontend

* React + TypeScript
* Vite
* TailwindCSS
* Recharts
* React Router

### Integración

* Axios
* API REST (Node.js + Express backend)

---

## ⚙️ Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/paycore-wallet-console.git
cd paycore-wallet-console
```

---

### 2. Instalar dependencias

```bash
npm install
```

---

### 3. Variables de entorno

Crear archivo `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

---

### 4. Ejecutar proyecto

```bash
npm run dev
```

---

## 🌐 Backend requerido

Este frontend consume la API de:

👉 Paycore Backend

Debe estar corriendo en:

```txt
http://localhost:3000/api
```

---

## 📡 Endpoints utilizados

```http
POST   /api/auth/login
GET    /api/transfers?page=1&limit=10
POST   /api/transfers
GET    /api/accounts
GET    /api/analytics/summary
GET    /api/analytics/alerts
GET    /api/analytics/smart-alerts
```

---

## 🎯 Objetivo del proyecto

Simular una aplicación real de gestión financiera, aplicando:

* Arquitectura frontend escalable
* Integración con backend paginado
* UX moderna tipo SaaS
* Visualización de datos

---

## 📌 Autor

Ignacio Bruno
Proyecto desarrollado como portfolio fullstack.
