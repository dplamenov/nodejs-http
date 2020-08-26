const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const formidable = require('formidable');
const breeds = require('../data/breeds');
const cats = require('../data/cats');
const expressResponse = require('../express');

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;
    if (pathname === '/cats/add-cat' && req.method === 'GET') {

        fs.readFile('./views/addCat.html', 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
            }

            res.writeHead(200, {
                'Content-type': 'text/html'
            });

            data = data.replace('{{catBreeds}}', breeds.map(breed => `<option value="${breed}">${breed}</option>`));

            res.write(data);
            res.end();
        });

    } else if (pathname === '/cats/add-breed' && req.method === 'GET') {

        fs.readFile('./views/addBreed.html', 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
            }

            res.writeHead(200, {
                'Content-type': 'text/html'
            });

            res.write(data);
            res.end();
        });

    } else if (pathname === '/cats/add-breed' && req.method === 'POST') {
        const form = formidable({ multiples: true });

        form.parse(req, (err, fields) => {
            const currentBreeds = breeds.slice();

            fs.writeFile('./data/breeds.json', JSON.stringify(currentBreeds.concat(fields.breed)), 'utf-8', (err) => {
                if (err) {
                    console.error(err);
                }
            });

            res.writeHead(302, {
                'Location': '/'
            });
            res.end();
        });
    } else if (pathname === '/cats/add-cat' && req.method === 'POST') {
        const form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            const oldpath = files.upload.path;
            const newpath = path.resolve('content', 'images', files.upload.name);

            fs.rename(oldpath, newpath, (err) => {
                if (err) {
                    console.error(err);
                }

                const catsArray = cats.concat({
                    id: cats.length + 1,
                    name: fields.name,
                    description: fields.description,
                    breed: fields.breed,
                    image: files.upload.name
                });

                fs.writeFile('./data/cats.json', JSON.stringify(catsArray), 'utf-8', (err) => {
                    if (err) {
                        console.error(err);
                    }

                    res.writeHead(302, {
                        'Location': '/'
                    });
                    res.end();
                });

            });
        });
    } else {
        return true;
    }
}