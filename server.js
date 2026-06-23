const express = require('express');
const axios = require('axios');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express();
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const JWT_SECRET = 'my_super_secret_cyber_security_key_123';

// =======================================================
// 🗄️ MONGODB PERMANENT DATABASE CONFIGURATION
// =======================================================
mongoose.connect('mongodb://localhost:27017/shield_academy')
    .then(() => console.log('[DATABASE] Permanent MongoDB cluster connected successfully!'))
    .catch((err) => console.error('[CRITICAL] MongoDB storage connection failure:', err.message));

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' } 
});

const User = mongoose.model('User', UserSchema);

const OrderSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    courseId: { type: String, required: true },
    courseName: { type: String, required: true },
    purchaseDate: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// 🔥 100% FULL DATA STRUCT: ALL 6 CYBER CURRICULUMS LINKED WITH MODULES
const courses = [
    { 
        id: "cs-bundle", 
        name: "Cyber Security Course Bundle", 
        price: 4999, 
        desc: "Complete training from scratch to advanced level security.", 
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=500&q=80",
        modules: [
            { title: "Module 1: Introduction to Cyber Defense Fundamentals", duration: "45 mins" },
            { title: "Module 2: Setting up your Kali Linux Virtual Sandbox Environment", duration: "1 hour" },
            { title: "Module 3: Scanning and Footprinting Network Nodes", duration: "1.5 hours" }
        ]
    },
    { 
        id: "eth-hacking", 
        name: "Ethical Hacking Essentials", 
        price: 3500, 
        desc: "Learn penetration testing, bug bounty tracking, and network hacking.", 
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&q=80",
        modules: [
            { title: "Module 1: Ethical Hacking Methodologies & Legal Frameworks", duration: "30 mins" },
            { title: "Module 2: Exploiting Web App Vulnerabilities (OWASP Top 10)", duration: "2 hours" },
            { title: "Module 3: Advanced Privilege Escalation Techniques", duration: "1 hour" }
        ]
    },
    { 
        id: "net-security", 
        name: "Network Security & Defense", 
        price: 2999, 
        desc: "Master firewall configuration, protocol analysis, and active defense.", 
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=500&q=80",
        modules: [
            { title: "Module 1: Wireshark Packet Analysis & Traffic Logging", duration: "1.2 hours" },
            { title: "Module 2: Configuring Impenetrable Firewall Policies", duration: "45 mins" },
            { title: "Module 3: Active IDS/IPS Response Configuration Matrix", duration: "1.5 hours" }
        ]
    },
    { 
        id: "cloud-devsecops", 
        name: "Cloud Security & DevSecOps", 
        price: 5500, 
        desc: "Master AWS/Azure security infrastructure, Docker hardening, and automated CI/CD pipelines.", 
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&q=80",
        modules: [
            { title: "Module 1: Cloud Architecture Vectors & Shared Responsibility", duration: "1 hour" },
            { title: "Module 2: Container Security & Docker Hardening Kernels", duration: "1.5 hours" },
            { title: "Module 3: Building Automated Secure CI/CD Pipelines", duration: "2 hours" }
        ]
    },
    { 
        id: "adv-pentesting", 
        name: "Advanced PenTesting & Bug Bounty", 
        price: 6000, 
        desc: "Master advanced web app exploitation, privilege escalation, and live bug hunting methodologies.", 
        image: "https://images.unsplash.com/photo-1624969862644-791f3dc98927?auto=format&fit=crop&w=500&q=80",
        modules: [
            { title: "Module 1: Custom Exploit Payload Generation & Assembly", duration: "2 hours" },
            { title: "Module 2: Hunting Live Subdomains & API Target Infrastructure", duration: "1.8 hours" },
            { title: "Module 3: Advanced Buffer Overflow Verification Nodes", duration: "2.5 hours" }
        ]
    },
    { 
        id: "digital-forensics", 
        name: "Digital Forensics & Incident Response", 
        price: 5200, 
        desc: "Learn cyber crime investigation, malware analysis, memory forensics, and threat hunting.", 
        image: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=500&q=80",
        modules: [
            { title: "Module 1: Memory Partition Dumping & Volatility Analysis", duration: "2.5 hours" },
            { title: "Module 2: Investigating Windows Registry Malicious Injections", duration: "1.5 hours" },
            { title: "Module 3: Threat Hunting Blue-Team Mitigation Arrays", duration: "1.2 hours" }
        ]
    }
];

// =======================================================
// 🔐 ROUTE AUTHENTICATION GUARD MIDDLEWARE
// =======================================================
const checkAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login'); 

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified; 
        next(); 
    } catch (err) {
        res.clearCookie('token');
        res.redirect('/login');
    }
};

const checkAdmin = (req, res, next) => {
    console.log(`[GATEWAY-GUARD] Verifying Access for: ${req.user.email} | Role: ${req.user.role}`);
    
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send("<h1>Access Denied</h1><p>You do not have administrative privilege parameters to access this console node.</p>");
    }
};

// =======================================================
// 🌐 AUTHENTICATION CONTROLLER ENDPOINTS
// =======================================================
app.get('/register', (req, res) => { res.render('register', { error: null }); });

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if(userExists) return res.render('register', { error: 'Email already registered!' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const totalUsers = await User.countDocuments();
        const assignedRole = (totalUsers === 0) ? 'admin' : 'user';

        const newUser = new User({ name, email, password: hashedPassword, role: assignedRole });
        await newUser.save(); 
        
        console.log(`[AUTH-DB] Registered profile: ${email} -> ROLE: ${assignedRole}`);
        res.redirect('/login');
    } catch (err) {
        res.render('register', { error: 'Registration matrix failure block.' });
    }
});

app.get('/login', (req, res) => { res.render('login', { error: null }); });

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user) return res.render('login', { error: 'Invalid email or password!' });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.render('login', { error: 'Invalid email or password!' });

        const token = jwt.sign(
            { name: user.name, email: user.email, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.cookie('token', token, { httpOnly: true });
        console.log(`[AUTH-DB] Permanent login validation activated: ${user.email} [Role: ${user.role}]`);
        res.redirect('/');
    } catch (err) {
        res.render('login', { error: 'Server authentication pipeline crashed.' });
    }
});

app.get('/logout', (req, res) => { res.clearCookie('token'); res.redirect('/login'); });

// =======================================================
// 🛒 CORE MULTI-PAGE SECURED VIEWS
// =======================================================
app.get('/', checkAuth, (req, res) => { res.render('index', { courses: courses, user: req.user }); });
app.get('/courses', checkAuth, (req, res) => { res.render('courses', { courses: courses, user: req.user }); });

app.get('/dashboard', checkAuth, async (req, res) => {
    try {
        const enrolledOrders = await Order.find({ userEmail: req.user.email });
        res.render('dashboard', { user: req.user, orders: enrolledOrders });
    } catch (err) {
        res.status(500).send("Dashboard extraction failure.");
    }
});

// 🛡️ SECURED COURSE CONTENT ROUTE: SHIELD FOR ACTIVE ENROLLED STUDENTS ONLY
app.get('/course/:courseId', checkAuth, async (req, res) => {
    const { courseId } = req.params;
    
    try {
        const isEnrolled = await Order.findOne({ userEmail: req.user.email, courseId: courseId });
        
        if (!isEnrolled) {
            console.log(`[SECURITY-DENIED] Unauthorised course content attempt by: ${req.user.email} on node: ${courseId}`);
            return res.status(403).send("<h1>Access Denied</h1><p>You need to purchase this module node to unlock the curriculum assets pipeline.</p>");
        }

        const selectedCourse = courses.find(c => c.id === courseId);
        res.render('course-content', { user: req.user, course: selectedCourse });
        
    } catch (err) {
        res.status(500).send("Critical error loading the secure curriculum player node.");
    }
});

// =======================================================
// 🧠 LIVE CYBER SECURITY QUIZ ENGINES
// =======================================================
const quizQuestions = [
    { id: 1, q: "Which protocol is completely unencrypted?", options: ["HTTPS", "HTTP", "SSH", "SFTP"], answer: "HTTP" },
    { id: 2, q: "What does a 403 HTTP status code signify?", options: ["Not Found", "Internal Error", "Forbidden Access", "Bad Request"], answer: "Forbidden Access" }
];

app.get('/course/:courseId/quiz', checkAuth, async (req, res) => {
    const { courseId } = req.params;
    
    try {
        const isEnrolled = await Order.findOne({ userEmail: req.user.email, courseId: courseId });
        if (!isEnrolled) return res.status(403).send("<h1>Access Denied</h1><p>Unlock this module criteria node first.</p>");
        
        const selectedCourse = courses.find(c => c.id === courseId);
        res.render('quiz', { user: req.user, course: selectedCourse, questions: quizQuestions });
    } catch (err) {
        res.status(500).send("Quiz rendering engine failure.");
    }
});

app.post('/api/quiz/submit', checkAuth, async (req, res) => {
    const { courseId, score, totalQuestions } = req.body;
    
    if (parseInt(score) === parseInt(totalQuestions)) {
        try {
            console.log(`[QUIZ-SUCCESS] ${req.user.email} cleared criteria node. Triggering n8n Certificate Generator...`);
            const n8nCertificateUrl = 'http://localhost:5678/webhook/ecommerce-order';
            
            await axios.post(n8nCertificateUrl, {
                name: req.user.name,
                email: req.user.email,
                courseId: courseId,
                status: "COMPLETED"
            });
        } catch (err) {
            console.log("[AUTOMATION-WARN] n8n Certificate webhook node offline during quiz clearance.");
        }
    }
    res.json({ success: true, score });
});

// =======================================================
// 📊 ADMINISTRATIVE CONTROL & METRICS ENDPOINTS
// =======================================================
app.get('/admin/dashboard', checkAuth, checkAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        
        const allUsers = await User.find({}, '-password'); 
        const allOrders = await Order.find().sort({ purchaseDate: -1 }); 
        
        res.render('admin_dashboard', { 
            user: req.user, 
            stats: { users: totalUsers, orders: totalOrders },
            users: allUsers,
            orders: allOrders
        });
    } catch (err) {
        res.status(500).send("Admin infrastructure audit metric failure.");
    }
});

app.get('/api/admin/financial-stats', checkAuth, checkAdmin, async (req, res) => {
    try {
        const allOrders = await Order.find({});
        let totalRevenue = 0;
        const courseSalesCount = {};

        allOrders.forEach(order => {
            const courseDetails = courses.find(c => c.id === order.courseId);
            const price = courseDetails ? courseDetails.price : 0;
            totalRevenue += price;
            courseSalesCount[order.courseName] = (courseSalesCount[order.courseName] || 0) + 1;
        });

        res.json({
            success: true,
            totalRevenue,
            totalSales: allOrders.length,
            breakdown: courseSalesCount
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Analytics extraction node failure." });
    }
});

app.get('/about', checkAuth, (req, res) => { res.render('about', { user: req.user }); });

// 🧪 DATABASE FLUSH ENGINE ROUTE LINKED FOR FRESH TESTS
app.get('/flush-db', async (req, res) => {
    try {
        await User.deleteMany({});
        await Order.deleteMany({});
        res.send("<h1>Database Flushed!</h1><p>MongoDB completely cleared. Go back to <a href='/register'>Register Page</a> and create your first admin account now.</p>");
    } catch (err) {
        res.status(500).send("Database clear failure.");
    }
});

// =======================================================
// 🔥 API CHECKOUT GATEWAY: WEBHOOK & DB SYNCHRONIZATION
// =======================================================
app.post('/api/checkout-mock', async (req, res) => {
    const { name, email, courseId, paymentStatus } = req.body;
    const selectedCourse = courses.find(c => c.id === courseId);
    if (!selectedCourse) return res.status(404).json({ success: false, message: 'Course not found.' });

    if (paymentStatus !== 'SUCCESS') {
        console.log(`[GATEWAY-DENIED] Strict Check: Card verification failure for ${email}.`);
        return res.status(400).json({ success: false, message: 'Payment authorization failed or declined.' });
    }

    try {
        const n8nWebhookUrl = 'http://localhost:5678/webhook/ecommerce-order';
        console.log(`[GATEWAY-PENDING] Despatching payload to n8n node...`);
        
        const n8nResponse = await axios.post(n8nWebhookUrl, { 
            name, 
            email, 
            product: selectedCourse.name, 
            amount: selectedCourse.price 
        });

        if (n8nResponse.status === 200) {
            const newOrder = new Order({ userEmail: email, courseId: courseId, courseName: selectedCourse.name });
            await newOrder.save();
            
            console.log(`[GATEWAY-SUCCESS] Automation Loop Confirmed. Order permanently locked for: ${email}`);
            return res.status(200).json({ success: true });
        } else {
            throw new Error('Automation node rejected handshake payload.');
        }

    } catch (error) {
        console.log(`[CRITICAL-BLOCK] Transaction aborted! n8n execution pipeline was completely inactive.`);
        return res.status(500).json({ 
            success: false, 
            message: 'Automation loop inactive. Please click Execute Workflow in n8n first!' 
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`E-Commerce Scale Server running at: http://localhost:${PORT}`);
    console.log(`=======================================================`);
});
module.exports = app;