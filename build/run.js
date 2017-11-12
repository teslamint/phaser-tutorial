const fsbx = require("fuse-box");
const production = (process.env.NODE_ENV === 'production');
var fuse, app, vendor, Sparky = fsbx.Sparky;

Sparky.task("config", [], function () {
    fuse = new fsbx.FuseBox({
        homeDir: "../src",
        output: "../dist/$name.js",
        tsconfig: "../tsconfig.json",
        hash: production,
        cache: !production,
        target: "es3",
        // useJsNext: true,
        useTypescriptCompiler: true,
        polyfillNonStandardDefaultUsage : true,
        plugins: [
            fsbx.EnvPlugin({
                NODE_ENV: production ? "production" : "development"
            }),
            production && fsbx.UglifyJSPlugin(),
            fsbx.WebIndexPlugin({
                title: 'Phaser.io TypeScript HTML5 Example',
                template: '../src/templates/index.html',
                path: '.'
            }),
        ],
    });
    vendor = fuse.bundle("vendor")
        .target('browser')
        // .sourceMaps(production)
        .instructions("~app.ts")
        .shim({
            p2: {
                source: "../node_modules/phaser-ce/build/custom/p2.js",
                exports: "p2"
            },
            pixi: {
                source: "../node_modules/phaser-ce/build/custom/pixi.js",
                exports: "PIXI"
            },
            phaser: {
                source: "../node_modules/phaser-ce/build/custom/phaser-split.js",
                exports: "Phaser"
            }
        });
    app = fuse.bundle("app")
        .target('browser')
        .instructions("!>[app.ts]");
});

Sparky.task("clean", [], function() {
    return Sparky.src("../dist/").clean("../dist/");
});

Sparky.task("copy", [], function() {
    return Sparky.src("../resources/**/**.*", { base: '../resources' })
        .dest("../dist/assets");
});

Sparky.task("default", ["clean", "config", "copy"], function() {
    fuse.run();
});

Sparky.task("watch", ["clean", "config"], function() {
    app.watch()
        .hmr();
    vendor.watch();
    fuse.dev({
        root: '../dist',
        port: 8080
    });
    fuse.run();
});
