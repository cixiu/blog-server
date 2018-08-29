import app from './app';
import { PORT, PORT_TEST } from './utils/secrets';

const port = process.env.NODE_ENV === 'test' ? PORT_TEST : PORT;

app.listen(port, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
