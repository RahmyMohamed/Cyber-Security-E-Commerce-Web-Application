# 🛡️ Shield Academy - Professional Cyber Store & Automation Lab
![preview img](image.png)
![preview img](image-2.png)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/)

Shield Academy is an advanced, full-stack cybersecurity e-commerce storefront and learning management portal. It provides students with seamless access to industry-grade training bundles and virtual lab sandbox environments while implementing cutting-edge enterprise automation behind the scenes.

---

## 🚀 Key Features

* **Premium Cyber-Themed UI:** Built with a dark matrix aesthetics engine featuring custom red background particle connections and neon glitch branding animations.
* **Dynamic Content Extraction:** Integrated with a database engine to loop and render available cybersecurity defense modules and student metrics flawlessly.
* **Sandbox Simulation Threat Scanner:** Built-in network node simulation console displaying dynamic SSL handshakes, buffer bypass vectors, and exploit mock logging.
* **Secure Simulated Checkout:** Features an encrypted payment modal that enforces processing animation matrices and real-time conditional evaluation loops (CVV verification logic).
* **Enterprise n8n Production Automation:** 100% automated backend integration using production-ready webhooks to handle transaction synchronization on autopilot.

---

## 🛠️ Technology Stack

* **Frontend:** HTML5, CSS3 (Custom Grid layouts, CSS Variables, Backdrop-Filters), JavaScript (ES6+), FontAwesome Icons.
* **Backend:** Node.js, Express.js (REST API Endpoints, Dynamic Routing).
* **View Engine:** EJS (Embedded JavaScript templates for user payload rendering).
* **Workflow Automation Engine:** n8n (Production Orchestration Platform).

---

## 💱 n8n SecOps Automation Workflows

The repository features active architectural integration with **n8n**, running continuously in a standalone production framework to handle event-driven payloads:

### 1. Order Confirmation & Database Auditing
When a trainee authorizes an encrypted checkout node, the Node.js server broadcasts a real-time transactional event to the n8n Production Webhook.
* **Data Logging:** n8n automatically intercepts the incoming JSON payload and appends structured rows containing student identifiers directly into cloud data infrastructure sheets.
* **Dynamic Dispatch Management:** Employs advanced HTML templating blocks to construct formatted confirmation receipts with custom break lines and targeted bold typeface tracking (`<strong>{{ $json.Product }}</strong>`), dispatching them directly via enterprise notification gateways.

---

## ⚙️ Project Installation & Local Setup

Follow these steps to deploy the infrastructure node locally:

### 1. Clone the Repository
```bash
git clone https://github.com/RahmyMohamed/Cyber-Security-E-Commerce-Web-Application.git
cd shield-academy
```
2. Install Dependency Nodes
```Bash
npm install
```
3. Environment & Server Configuration
Ensure your server variables or environment parameters point to your active n8n instance infrastructure:
Open your main orchestration file (server.js) and assign your n8n Production Webhook URL to the designated pipeline variable:

JavaScript
  const n8nWebhookUrl = 'http://localhost:5678/webhook/your-production-endpoint';

4. Boot the Microservice
```Bash
npm start
The console will initialize, and the storefront will be reachable at http://localhost:3000.
```
🧠 Core Engineering Learning Outcomes
Developed during technical upskilling at Imara Software Solutions, this system provided deep architectural expertise in:

Transitioning workflows from conditional Test URLs to permanent, autonomous Production URLs inside enterprise systems.

Managing event-driven request-response lifecycles via backend communication loops.

Structuring multi-node integration paths involving dynamic parameters, data mappings, and downstream routing targets.

© 2026 Shield Academy Enterprise. Built for high-performance workflow automation studies.
