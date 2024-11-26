import { getRawJSON, writeRawJSON } from "./store";
const STORE_ROUTE = "store/dynamic/topics.json";

export async function getTopics() {
  const store = await getRawJSON(STORE_ROUTE);
  const { topics } = store;

  return topics && topics.length ? topics : []
}

export async function addTopic(topic) {
    console.log("addTopic", topic);
    const store = await getRawJSON(STORE_ROUTE);
    const { topics } = store;
    console.log("topics", topics);
  
    if(topics.includes(topic)) {
        return false;
    }

    console.log("pushing topic", topic);
    topics.push(topic);
    store.topics = topics;
    console.log("writing store", store);
    await writeRawJSON(STORE_ROUTE, store);
    console.log("done");
    
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
