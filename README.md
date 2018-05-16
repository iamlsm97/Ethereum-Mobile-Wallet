# crypto-wallet-react-native

## Prerequisites
You need node, npm, watchman, and react-native-cli for both platforms(android, ios).

example for macOS environment
```bash
$ brew install node
$ brew install watchman
$ npm install -g react-native-cli
```

for android, you need Android Studio and Android 6.0 (Marshmallow) SDK.  
for ios, you need Xcode.

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
