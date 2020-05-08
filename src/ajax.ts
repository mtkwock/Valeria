/**
 * Simpler ajax function so that jQuery isn't necessary.  Only things required
 * are the url and optionally a done and fail function.
 */

function ajax(url: string) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.send(null);
  let doneFn: (data: any) => any = (data: any) => console.log(data);
  let failFn: (msg: string) => any = (msg: string) => console.error(msg);

  xhr.onreadystatechange = () => {
    const DONE = 4; // readyState 4 means the request is done.
    const OK = 200; // status 200 is a successful return.
    if (xhr.readyState === DONE) {
      if (xhr.status === OK) {
        doneFn(xhr.responseText);
        // console.log(xhr.responseText); // 'This is the returned text.'
      } else {
        failFn('Error: ' + xhr.status);
        // console.log('Error: ' + xhr.status); // An error occurred during the request.
      }
    }
  };

  return {
    done: (fn: (data: any) => any) => {
      doneFn = fn;
    },
    fail: (fn: (msg: string) => any) => {
      failFn = fn;
    },
  };
}

export {ajax};
