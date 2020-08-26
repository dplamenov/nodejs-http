const url = require('url');
const fs = require('fs');
const path = require('path');


module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;

    if (pathname === '/' && req.method === 'GET') {
        const filePath = path.normalize(path.join(__dirname, '../views/home/index.html'));

        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
            }

            res.writeHead(200, {
                'Content-type': 'text/html'
            });

            fs.readFile('./data/cats.json', 'utf-8', (err, catsData) => {
                if (err) {
                    console.error(err);
                }

                const cats = JSON.parse(catsData);
                const catsElements = cats.map(c => {
                    return `<li>
                    <img src="content/images/${c.image}" alt="${c.name}">
                    <h3>${c.name}</h3>
                    <p><span>Breed: </span>${c.breed}</p>
                    <p><span>Description: </span>${c.description}</p>
                    <ul class="buttons">
                        <li class="btn edit"><a href="/cats/edit?catId=${c.id}">Change Info</a></li>
                        <li class="btn delete"><a href="">New Home</a></li>
                    </ul>
                </li>`;
                });
                console.log(catsElements);
                res.write(data.replace('{{cats}}', catsElements.join('')));
                res.end();
            });
        });

    } else {
        return true;
    }
}