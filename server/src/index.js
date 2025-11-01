import app from './app.js';
import { initializePool, closePool } from './db.js';

const PORT = process.env.PORT || 3000;
const USE_MEMORY_MODE = process.env.USE_MEMORY_MODE === 'true';

async function startServer() {
  try {
    // Initialize DB pool if not in memory mode
    if (!USE_MEMORY_MODE) {
      try {
        await initializePool();
        console.log('✓ Database connection established');
      } catch (dbErr) {
        console.warn('⚠ Database connection failed, falling back to in-memory mode');
        console.error(dbErr.message);
        process.env.USE_MEMORY_MODE = 'true';
      }
    } else {
      console.log('✓ Running in in-memory mode (no database)');
    }

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
      console.log(`Mode: ${USE_MEMORY_MODE || process.env.USE_MEMORY_MODE === 'true' ? 'In-Memory' : 'Database'}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, closing gracefully...');
      server.close(async () => {
        await closePool();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('\nSIGINT received, closing gracefully...');
      server.close(async () => {
        await closePool();
        process.exit(0);
      });
    });

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
