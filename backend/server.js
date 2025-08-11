const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Export the app object for testing
if (require.main === module) {
    connectDB();
    // If the file is run directly, start the server
    //20250811 const PORT = process.env.PORT || 5001;
    //20250811 app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, '0.0.0.0', () => { console.log(`Server running on port ${PORT}`);});
    console.log(`Listening on all interfaces at port ${PORT}`);
  }


module.exports = app