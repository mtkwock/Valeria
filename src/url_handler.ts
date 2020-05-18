
// Copied from: https://davidwalsh.name/query-string-javascript
function getUrlParameter(name: string): string {
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
  const matcher = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = matcher.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1]);
}

export {
  getUrlParameter,
};
