import { getRawJSON, writeRawJSON } from "./store";
const STORE_ROUTE = "@/store/topics.json";

export async function getTopics() {
  const store = await getRawJSON(STORE_ROUTE);
  const { topics } = store;

  return topics && topics.length ? topics : []
}

export async function addTopic(topic) {
    const store = await getRawJSON(STORE_ROUTE);
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
    const store = await getRawJSON(STORE_ROUTE);
    const { topics } = store;
  
    const updatedTopics = topics.filter(t => t !== topic)
    if(topics.length == updatedTopics.length) {
        return false
    }

    store.topics = updatedTopics
    await writeRawJSON(STORE_ROUTE, store);

    return true
}
