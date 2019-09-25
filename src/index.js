import app from './app';
import { port } from './config/config'

async function main() {
    await app.listen(port);
    console.log(`Server on port ${port}`);
}

main();