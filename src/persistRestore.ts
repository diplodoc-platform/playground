import {useCallback} from 'react';

function persist(input: string) {
  try {
    const current = new URL(location.toString());
    current.searchParams.set('input', encodeURI(input) ?? '');

    history.pushState(null, null, current);
  } catch (err) {
    console.error(err);
  }
}

function restore() {
  try {
    const search = new URLSearchParams(window.location.search);
    let input = search.get('input');
    if (input?.length) {
      input = decodeURI(input);
    } else {
      return '';
    }

    return input;
  } catch (err) {
    return '';
  }
}

export {persist, restore};
export default {persist, restore};
