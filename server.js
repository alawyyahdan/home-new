const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3005;

// Serve all static files from the current directory (index.html, style.css, app.js, dll)
app.use(express.static(__dirname));

// Catch-all route untuk menangkap request yang file-nya gak ketemu (404)
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Portfolio server is running on http://localhost:${PORT}`);
});
