# crypto-wallet-react-native

## Prerequisites
You need node, npm, watchman, and react-native-cli for both platforms(android, ios).

example for macOS environment
```bash
$ brew install node
$ brew install watchman
$ npm install -g react-native-cli
```

##### for `android`
You need Android Studio, Android 6.0 (Marshmallow) SDK and NDK.  
##### for `ios`
You need Xcode.

Check for the "Building Projects with Native Code" part of the document for more specific information.  
https://facebook.github.io/react-native/docs/getting-started.html

## Run Application
Download project & Install dependencies
```bash
$ git clone {this repository}
$ cd crypto-wallet-react-native
$ npm install
```

for Running react-native application
```bash
$ react-native run-android
$ react-native run-ios
```

for Accessing console logs
```bash
$ react-native log-android
$ react-native log-ios
```

for Linting the javascript code (not necessary to pass)
```bash
$ npm run lint
```

### ( optional ) if the Build Fails

#### in `android`
if your failure message seems like below,
> FAILURE: Build failed with an exception.  
>
> \* What went wrong:  
> A problem occurred configuring project ':app'.  
> \> Could not resolve all dependencies for configuration ':app:_debugApk'.  
> &nbsp;&nbsp;&nbsp;\> A problem occurred configuring project ':react-native-fast-crypto'.  
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\> NDK not configured.  
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Download it with SDK manager.)  

Create a local.properties file in the android directory of your react-native app with the following contents:
```properties
#local.properties
sdk.dir=/Users/edwin/Library/Android/sdk
ndk.dir=/Users/edwin/Library/Android/sdk/ndk-bundle
```

Check for the "Building React Native from source" part of the document for more specific information.  
https://facebook.github.io/react-native/docs/building-from-source.html

#### in `ios`
if your failure message seems like below,
> ld: '/Users/edwin/Library/Developer/Xcode/DerivedData/cryptowallet-gswngsstghqlqseyomsxqueexzmm/Build/Products/Debug-iphoneos/libRNFastCrypto.a(native-crypto.o)' does not contain bitcode. You must rebuild it with bitcode enabled (Xcode setting ENABLE_BITCODE), obtain an updated library from the vendor, or disable bitcode for this target. for architecture arm64
clang: error: linker command failed with exit code 1 (use -v to see invocation)

Disables the bitcode option at:  
Targets > Build Settings > Build Options > Enable Bitcode : No
