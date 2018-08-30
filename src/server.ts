import app from './app';
import { PORT } from './utils/secrets';

export default app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
