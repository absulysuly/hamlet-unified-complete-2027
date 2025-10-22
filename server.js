// Ensure backend API boots when hosting platforms run `node server.js` at repo root.
import('./backend/dist/index.js')
  .catch((error) => {
    console.error('Failed to start backend from compiled output. Run `npm run backend:build` first.', error);
    process.exit(1);
  });
