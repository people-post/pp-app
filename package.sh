#!/bin/bash
#set -x
ExitOnError() {
    exit_code=$1
    if [ $exit_code -ne 0 ]; then
        >&2 echo "Last command failed with exit code ${exit_code}."
        exit $exit_code
    fi
}

CompileJs() {
    fileList=$1
    temp=$2
    target=$3
    ./mergejs $fileList $temp
    terser -c defaults -m --mangle-props regex=/^_/ $temp --source-map -o $target
    ExitOnError $? !!
}

# 1. Reset workdir
WORK_DIR=obj
if [ -d $WORK_DIR ]
then
    rm -r $WORK_DIR
fi
mkdir $WORK_DIR

# 2. Prepare js
ENTRY_JS_PATH=src/index.js
BUNDLE_JS_PATH=$WORK_DIR/app-min.js

#  a.1 Compile legacy app js
CompileJs app/file_list.txt $WORK_DIR/app.js $BUNDLE_JS_PATH
CompileJs sw/file_list.txt $WORK_DIR/sw.js $WORK_DIR/sw-min.js

#  a.2 bundle into single js file
esbuild $ENTRY_JS_PATH --bundle --platform=node --outfile=$BUNDLE_JS_PATH

#  b. Prepare css
uglifycss css/hst.css > $WORK_DIR/hst-min.css

# 3. Packaging
WEB3_PACKAGE=web3.tar

# 3.1 Prepare files
WEB2_DIR=$WORK_DIR/web2
mkdir $WEB2_DIR
mkdir $WEB2_DIR/static
mkdir $WEB2_DIR/static/js
mkdir $WEB2_DIR/static/css
cp $BUNDLE_JS_PATH $WEB2_DIR/static/js/hst-min.js
cp $WORK_DIR/sw-min.js $WEB2_DIR/static/js/sw-min.js
cp $WORK_DIR/hst-min.css $WEB2_DIR/static/css/hst-min.css

# 3.11 web3 deployments
WEB3_DIR=$WORK_DIR/web3
mkdir $WEB3_DIR
mkdir $WEB3_DIR/user
mkdir $WEB3_DIR/static
cp html/web3.html $WEB3_DIR/index.html
cp $WORK_DIR/hst-min.css $WEB3_DIR/static/hst-min.css
cp $BUNDLE_JS_PATH $WEB3_DIR/static/hst-min.js
cp configs/web3_config.js $WEB3_DIR/user/config.js
cp configs/web3_config_example.js $WEB3_DIR/user/config.js.bak
cp ext/keyproducer.min.js $WEB3_DIR/static/keyproducer-min.js
cp ext/multiformats.min.js $WEB3_DIR/static/multiformats-min.js
cp ext/multiaddr.min.js $WEB3_DIR/static/multiaddr-min.js
cp ext/libp2ppeerid.min.js $WEB3_DIR/static/libp2ppeerid-min.js
cp ext/libp2pcrypto.min.js $WEB3_DIR/static/libp2pcrypto-min.js
cp ext/libp2phttpfetch.min.js $WEB3_DIR/static/libp2phttpfetch-min.js
cp ext/cardano.min.js $WEB3_DIR/static/cardano-min.js
cp ext/helia.min.js $WEB3_DIR/static/helia-min.js
cp ext/heliaipns.min.js $WEB3_DIR/static/heliaipns-min.js
cp ext/heliaunixfs.min.js $WEB3_DIR/static/heliaunixfs-min.js
cp ext/heliafetch.min.js $WEB3_DIR/static/heliafetch-min.js

# 3.2 Create tarball
tar -C $WORK_DIR -cf $WEB3_PACKAGE web3

# 3.3 Zip package
gzip -f $WEB3_PACKAGE
