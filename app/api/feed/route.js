import Cache from "@/lib/cache";
import { getTopics } from "@/lib/topic";
import { getArticlesByTopic } from "@/lib/news-api";
import { summarizeArticlesByTopic, formatForSummarization } from "@/lib/summarize";
import { jsonResponse } from "@/utils/responseHelpers";
import { STATUS_MAP } from "@/lib/constants";

const TOPIC_LIMIT = 5;


export async function GET(req) {
    const LOG_PREFIX = "GET /feed handler:";
    
    try {
        let topics = await getTopics();
        if(!topics || !topics.length) {
            console.log(`${LOG_PREFIX} no topics to fetch. Defaulting to "news"`);
            topics.push("news");
        }
        if(topics.length > TOPIC_LIMIT) {
            console.log(`${LOG_PREFIX} Reached topic limit of ${TOPIC_LIMIT}. Reducing topics`);
            topics = topics.slice(0, TOPIC_LIMIT)
        }
        console.log(`${LOG_PREFIX} Fetching topics: ${topics}`);
        topics = topics.map(topic =>{
            return {    
                name:topic,
                status: STATUS_MAP.PENDING,
                articles: [],
                summary: ""
            }
        })
        console.log(`${LOG_PREFIX} Fetched topics: ${JSON.stringify(topics)}`);

        //Get cached topics
        const cache = new Cache();
        topics = await Promise.all(topics.map((topic) => 
            cache.get(topic.name)
            .then(data => {
                if(data) {
                    console.log(`${LOG_PREFIX} Successfully fetched cached topic: ${topic.name}`)
                    topic.status = STATUS_MAP.CACHED
                    topic.summary = data
                }
                return topic
            })
            .catch(e => {
                console.error(`${LOG_PREFIX} Error fetching cached topic: ${topic.name}. Error: ${e}`)
                topic.status = STATUS_MAP.ERROR
                return topic
            })
        ))
        console.log(`${LOG_PREFIX} Fetched cached topics: ${JSON.stringify(topics)}`);

        //fetch articles
        topics = await Promise.all(topics.map(async (topic) => {
            if(topic.status !== STATUS_MAP.PENDING) {
                return Promise.resolve(topic)
            }

            return getArticlesByTopic(topic.name)
                .then(data => {
                    if(data && data.length) {
                        console.log(`${LOG_PREFIX} Successfully fetched articles for topic: ${topic.name}`)
                        topic.articles = formatForSummarization(data)
                        topic.status = STATUS_MAP.FETCHED
                    }
                    else {
                        console.log(`${LOG_PREFIX} No articles fetched for topic: ${topic.name}`)
                        topic.status = STATUS_MAP.SKIPPED
                    }
                    return topic
                })
                .catch(e => {
                    console.error(`${LOG_PREFIX} Error fetching articles for topic: ${topic.name}. Error: ${e}`)
                    topic.status = STATUS_MAP.ERROR
                    return topic
                })
        }))
        console.log(`${LOG_PREFIX} Fetched articles: ${JSON.stringify(topics)}`);

        //summarize articles
        topics = await Promise.all(topics.map(async (topic) => {
            if(topic.status !== STATUS_MAP.FETCHED) {
                return Promise.resolve(topic)
            }
            return summarizeArticlesByTopic(topic.name, topic.articles)
                .then(data => {
                    if(data) {
                        console.log(`${LOG_PREFIX} Successfully summarized articles for topic: ${topic.name}`)
                        topic.summary = data
                    }
                    else {
                        console.log(`${LOG_PREFIX} No summary fetched for topic: ${topic.name}`)
                        topic.status = STATUS_MAP.SKIPPED
                    }
                    return topic
                })
                .catch(e => {
                    console.error(`${LOG_PREFIX} Error summarizing articles for topic: ${topic.name}. Error: ${e}`)
                    topic.status = STATUS_MAP.ERROR
                    return topic
                })
        }))
        console.log(`${LOG_PREFIX} Summarized articles: ${JSON.stringify(topics)}`);

        //cache new topics, send and forget
        Promise.all(topics.map((topic) => {
            if(topic.status !== STATUS_MAP.FETCHED || !topic.summary || typeof topic.summary !== "string") {
                return Promise.resolve()
            }
            return cache.set(topic.name, topic.summary)
                .catch(e => {
                    console.error(`${LOG_PREFIX} Error caching topic: ${topic.name}. Error: ${e}`)
                })
        }))
        
        //merged fetched and cached topics
        const topicResponses = topics.map(({name, status, summary}) => {
            return {
                topic: name,
                status,
                summary
            }    
        })

        return jsonResponse(topicResponses);
    } 
    catch (error) {
        console.error(LOG_PREFIX, "GeneralError:" + error);
        return jsonResponse("Internal Server Error", 500);
    }
}

