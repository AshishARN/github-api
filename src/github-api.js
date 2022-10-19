const https = require('https')

//'/users/' + 'mralexgray'
const func = async (url) => {
    const promise = new Promise((resolve, reject) => {
        var options = {
            host: 'api.github.com',
            path: url,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        };
        var body = ''
        var request = https.request(options, function (response) {
            response.on("data", function (chunk) {
                body += chunk.toString('utf8');
            });

            response.on("end", async function () {
                //console.log("Body: ", JSON.parse(body));
                resolve(JSON.parse(body))
            });
        });

        request.end();
    })

    const func2 = async (path) => {
        let val
        await promise.then((res) => {
            val = res
        })
        return val
    }
    return await func2()
}

module.exports = func