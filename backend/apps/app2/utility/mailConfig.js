const nodemailer = require('nodemailer');

async function checkConnection() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    // host: "sync.technologyland.co.th", 
    // port: 587, 
    // secure: false, 
    // ADD THIS LINE to force standard IPv4 routing:
    // family: 4, 
    // auth: {
    //   user: "pmo-cpi03@compact-brake.com",
    //   pass: "BQZy3a5e", 
    // }
    auth: {
        user: 'drp005@compact-brake.com',
        pass: 'kxffcqjxswpewdsw', // app password (no spaces)
    }
  });

  try {
    await transporter.verify();
    console.log("✅ SUCCESS: Server is ready to take our messages");
  } catch (error) {
    console.error("❌ FAILED: Transporter setup failed:", error.message);
  }
}

checkConnection();