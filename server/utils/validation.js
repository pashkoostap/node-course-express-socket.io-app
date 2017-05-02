const isRealString = (str) => {
  if (str.length > 0 && typeof str === 'string') {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  isRealString
}