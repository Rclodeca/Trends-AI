import Cache from "@/lib/cache";
import { getTopics } from "@/lib/topic";
import { getArticlesByTopic } from "@/lib/news-api";
import { summarizeArticlesByTopic, formatForSummarization } from "@/lib/summarize";
import { jsonResponse } from "@/utils/responseHelpers";

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

        //Get cached topics
        const cache = new Cache();
        const cacheMap = {}
        await Promise.all(topics.map(topic => 
            cache.get(topic)
            .then(data => {
                if(data) {
                    cacheMap[topic] = data
                    console.log(`${LOG_PREFIX} Successfully fetched cached topic: ${topic}`)
                }
            })
        ))
        .catch(e => {
            console.error(`${LOG_PREFIX} Error fetching cached topics: ${e}`)
        })

        //fetch articles
        const topicsToFetch = topics.filter(topic => !cacheMap[topic])
        const articlesByTopic = await Promise.all(
            topicsToFetch.map(topic => 
                getArticlesByTopic(topic)
                .then(articles => {
                    return  {
                        topic,
                        articles: formatForSummarization(articles)
                    }
                })
            )
        )

        //summarize articles
        const summaryByTopic = await Promise.all(
            articlesByTopic.map(({topic, articles}) => 
                summarizeArticlesByTopic(topic, articles)
            )
        )
        const fetchMap = {}
        summaryByTopic.forEach(({topic, summary}) => {
            fetchMap[topic] = summary
        })

        //cache new topics, send and forget
        Promise.all(summaryByTopic.map(({topic, summary}) =>
            cache.set(topic, summary)
        ))
        .catch(e => {
            console.error(`${LOG_PREFIX} Error caching topics: ${e}`)
        })
        
        //merged fetched and cached topics
        const mergedSummaries = topics.map(topic => {
            return {
                topic,
                summary: cacheMap[topic] || fetchMap[topic]
            }    
        })

        return jsonResponse(mergedSummaries);
    } 
    catch (error) {
        console.error(LOG_PREFIX, "Error:" + error);
        return jsonResponse("Internal Server Error", 500);
    }
}

