const { getCloudflareContext } = require("@opennextjs/cloudflare");

const { env } = await getCloudflareContext({ async: true });

export async function ExecuteQuery(query, params = []) {
    let q = env.DB.prepare(query);
    if (params.length > 0) {
        q = q.bind(...params);
    }
    const result = await q.all();
    console.log(result);
    
    return result.results;
}
