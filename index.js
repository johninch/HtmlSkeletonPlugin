class HtmlSkeletonPlguin {
    __PLUGIN_NAME__ = "HtmlSkeletonPlugin";

    // constructor(options = {}) {

    // }

    injectSkeleton(htmlData, callback) {
        htmlData.html = htmlData.html.replace(`<div id="app"></div>`,
        `<div id="app">
            <div style="background-color: yellowgreen;height: 500px;display: none;" id="firstPage">第一页 骨架屏</div>
            <div style="background-color: hotpink;height: 500px;display: none;" id="secondPage">第二页 骨架屏</div>
        </div>
        <script type=text/javascript>
            var hPath = location.pathname;

            if(hPath === '/entry/entry1.html') {
                document.getElementById('firstPage').style.display = 'block';
            } else if(hPath === '/entry/entry2.html') {
                document.getElementById('secondPage').style.display = 'block';
            }
        </script>`);
        callback(null, htmlData);
    };

    apply(compiler) {
        if (compiler.hooks) {
            // webpack 4 support
            compiler.hooks.compilation.tap(__PLUGIN_NAME__, compilation => {
                if (compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing) {
                    // HtmlWebPackPlugin 3.x
                    compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(__PLUGIN_NAME__, (htmlData, cb) => {
                        this.injectSkeleton(htmlData, cb);
                    });
                } else {
                    // HtmlWebPackPlugin 4.x
                    const HtmlWebpackPlugin = require('html-webpack-plugin');
                    HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(__PLUGIN_NAME__, (htmlData, cb) => {
                        this.injectSkeleton(htmlData, cb);
                    });
                }
            });
        } else {
            // webpack 3 support
            compiler.plugin('compilation', compilation => {
                compilation.plugin('html-webpack-plugin-before-html-processing', (htmlData, cb) => {
                    this.injectSkeleton(compilation, htmlData, cb);
                });
            });
        }
    }
}

module.exports = HtmlSkeletonPlguin;
