const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const { readdirSync } = require('fs');

const app = express();

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/mma_project', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('DB Connected'))
    .catch((err) => console.log('DB Connection Error:', err));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

// Product routes
app.use('/api/products', require('./routes/productRoutes'));

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 