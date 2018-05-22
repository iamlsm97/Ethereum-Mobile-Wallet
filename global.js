if (!global.btoa) {
  global.btoa = str => (Buffer.from(str, 'utf8').toString('base64'));
}
