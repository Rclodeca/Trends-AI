import fs from "fs/promises";
const STORE_ROUTE = "@/app/store/topics.json";
const ENCODING = "utf-8";

async function writeRawJSON(data) {
    return await fs.writeFile(STORE_ROUTE, JSON.stringify(store, null, 2));
}

async function getRawJSON() {
    const data = await fs.readFile(STORE_ROUTE, ENCODING);
    return JSON.parse(data);
}

export async function getTopics() {
  const store = await getRawJSON();
  const { topics } = store;

  return topics && topics.length ? topics : []
}

export async function addTopic(topic) {
    const store = await getRawJSON();
    const { topics } = store;
  
    if(topics.includes(topic)) {
        return false;
    }

    topics.push(topic);
    store.topics = topics;
    await writeRawJSON(store);
    
    return true
}

export async function deleteTopic(topic) {
    const store = await getRawJSON();
    const { topics } = store;
  
    const updatedTopics = topics.filter(t => t !== topic)
    if(topics.length == updatedTopics.length) {
        return false
    }

    store.topics = updatedTopics
    await writeRawJSON(store);

    return true
}
