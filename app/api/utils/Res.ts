export function DataResponse(jsonData:any, status:number = 200) {
    return new Response(JSON.stringify(jsonData), {
        status: status,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=86400",
        },
    });
}
