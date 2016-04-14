# BarcelonaJS

The Barcelona Original.

* Website: http://barcelonajs.org

## How to hack?

```
$ git clone -b development https://github.com/BarcelonaJS/barcelonajs.github.io.git
$ cd barcelonajs.github.io
$ git clone https://github.com/BarcelonaJS/BarcelonaJS.git src/data
```

Make the changes an visualize them,

Using npm:

```
$ npm install
$ npm run dev
```

or using docker:

```
$ docker build -t barcelonajs .
$ docker run -p 80:3000 -ti --rm -v `pwd`:/barcelonajs barcelonajs
```

When they are done, and you have made sure that the site looks great :D then stop the server and deploy them.

A very simple thing to avoid to get into a mess, is clone the master in another folder.

```
git clone -b master https://github.com/BarcelonaJS/barcelonajs.github.io.git live
```

Then copy all content that the `npm run dev` has generated in the `build` folder that you will find in the development branch that you have cloned in the other directory and copy them to this clone (which is in master branch), commit and push them and you're done, so have a break and enjoy life.
