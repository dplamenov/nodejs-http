const fs = require('fs');
const url = require('url');

function getContentType(url) {
    if (url.endsWith('css')) {
        return 'text/css';
    } else if (url.endsWith('png')) {
        return 'image/png';
    }

    return 'image/jpeg';
}


module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;
    if (pathname.startsWith('/content') && req.method === 'GET') {
        fs.readFile(`./${pathname}`, (err, data) => {
            if (err) {
                console.error(err);
            }
            res.writeHead(200, {
                'Content-type': getContentType(pathname)
            });
            res.write(data);
            res.end();
        });
    } else {
        return true;
    }
};