import { readFileSync } from 'fs';
import { resolve } from 'path'

async function readFile(file) {
    const pathToFile = resolve(`mocks/${file}/index.json`);
    const data = await readFileSync(pathToFile, "utf-8");
    return JSON.parse(data)
}

export { readFile };