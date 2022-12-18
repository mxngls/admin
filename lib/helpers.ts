const capitalizeFirstLetter = (string: string, locale = navigator.language) => {
  const first = string.substring(0, 1);
  const rest = string.substring(1);
  if (first === undefined) {
    return "";
  } else {
    return first.toLocaleUpperCase(locale) + rest.toLocaleLowerCase();
  }
};

const formatValue = (attribute: string, value: string | number) => {
  if (attribute === "price") {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(value as number);
  }
  return value;
};

const convertNumberType = (type: string) => {
  // Convert types returned from Postgres query to JS Objects
  // to enable comparision in useProductAttributeError hook
  return type === "string" ? "string" : "number";
};

// Corresponds to 10 frames at 60 Hz.
// A few bytes payload overhead when lodash/debounce is ~3 kB and debounce ~300 B.
const debounce = (callback: Function, wait = 166) => {
  let timeout: NodeJS.Timeout;
  const debounced = (...args: any[]) => {
    const later = () => {
      callback.apply(args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };

  debounced.clear = () => {
    clearTimeout(timeout);
  };

  return debounced;
};

export { capitalizeFirstLetter, formatValue, convertNumberType, debounce };
