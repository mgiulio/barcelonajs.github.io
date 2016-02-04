# BarcelonaJS

The Barcelona Original.

* Website: http://barcelonajs.org

## How to hack?

```
$ git clone https://github.com/BarcelonaJS/barcelonajs.github.io.git
$ cd barcelonajs.github.io
$ git clone https://github.com/BarcelonaJS/BarcelonaJS.git src/data
```

Using npm:

```
$ npm install
$ npm run dev
```


Using docker:

```
$ docker build -t barcelonajs .
$ docker run -p 80:3000 -ti --rm -v `pwd`:/barcelonajs barcelonajs
```
