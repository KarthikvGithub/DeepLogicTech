const http = require('http');
const https = require('https');
const PORT = 3000;
const url = 'https://time.com/';

const server = http.createServer((req,res) => {
    if(req.url=='/getTimeStories' && req.method == 'GET'){
        https.get(url, (result) => {
            let data = '';
            result.on('data',(matter) => {
                data += matter;
            })

            result.on('end', () => {
                const stories = [];

                // Extracting latest stories
                const startIndex = data.indexOf('<h2 class="latest-stories__heading">Latest Stories</h2>');
                const endIndex = data.indexOf('<section class="homepage-section-v2 mag-subs" data-module_name="Magazine Subscription"></section>', startIndex);

                const latestStoriesHtml = data.slice(startIndex, endIndex);
                // console.log(data);

                const storyItems = latestStoriesHtml.split('<li class="latest-stories__item">').slice(1);

                storyItems.forEach((storyItem) => {
                const titleStartIndex = storyItem.indexOf('<h3 class="latest-stories__item-headline">') + 42;
                const titleEndIndex = storyItem.indexOf('</h3>', titleStartIndex);
                const title = storyItem.slice(titleStartIndex, titleEndIndex).trim();

                const linkStartIndex = storyItem.indexOf('<a href="') + 9;
                const linkEndIndex = storyItem.indexOf('">', linkStartIndex);
                const link1 = storyItem.slice(linkStartIndex, linkEndIndex).trim();
                const link = `https://time.com${link1}`

                stories.push({title, link});
                });

                // Sending the JSON response
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(stories));
            })

            result.on('error', (e) => {
                console.error(`Error: ${e.message}`);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to fetch data from Time.com' }));
            });
        })
    }
    else{
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
    }
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});