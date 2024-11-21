import fs from "fs/promises";
const ENCODING = "utf-8";

export async function writeRawJSON(route, data) {
    return await fs.writeFile(route, JSON.stringify(data, null, 2));
}

export async function getRawJSON(route) {
    const data = await fs.readFile(route, ENCODING);
    return JSON.parse(data);
}