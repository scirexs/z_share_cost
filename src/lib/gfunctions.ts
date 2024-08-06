/********** Styling **********/
type StyleFull = StyleParts & StyleLayout;
type StylePartial = Partial<StyleFull>;

function getPartsStyle({
  size = undefined,
  mergin = undefined,
  bgcolor = undefined,
  border = undefined,
  bdwidth = undefined,
  bdcolor = undefined,
  bdround = undefined,
  txtcolor = undefined,
  txtbold = undefined,
  txtitalic = undefined,
  others = undefined,
}: StylePartsPartial): StylePartsPartial {
  const ret: StylePartsPartial = {};
  if (size) { ret.size = size; }
  if (mergin) { ret.mergin = mergin; }
  if (bgcolor) { ret.bgcolor = bgcolor; }
  if (border) { ret.border = border; }
  if (bdwidth) { ret.bdwidth = bdwidth; }
  if (bdcolor) { ret.bdcolor = bdcolor; }
  if (bdround) { ret.bdround = bdround; }
  if (txtcolor) { ret.txtcolor = txtcolor; }
  if (txtbold) { ret.txtbold = txtbold; }
  if (txtitalic) { ret.txtitalic = txtitalic; }
  if (others) { ret.others = others; }
  return ret;
}
function getLayoutStyle({
  direction = undefined,
  flexibility = undefined,
  wrap = undefined,
  mainpos = undefined,
  crosspos = undefined,
  gap = undefined,
  others = undefined,
}: StyleLayoutPartial): StyleLayoutPartial {
  const ret: StyleLayoutPartial = {};
  if (direction) { ret.direction = direction; }
  if (flexibility) { ret.flexibility = flexibility; }
  if (wrap) { ret.wrap = wrap; }
  if (mainpos) { ret.mainpos = mainpos; }
  if (crosspos) { ret.crosspos = crosspos; }
  if (gap) { ret.gap = gap; }
  if (others) { ret.others = others; }
  return ret;
}
function mergeStyle(baseStyle: StylePartial, owStyle?: StylePartial): StylePartial {
  if (owStyle === undefined) { return baseStyle; }
  const ret = {...owStyle};
  (Object.keys(baseStyle) as Array<keyof StyleFull>).forEach(key => {
    if (!Object.hasOwn(owStyle, key)) {
      ret[key] = baseStyle[key];
    }
  });
  return ret;
}
function getJoinStyle(style: StylePartial, ...adds: string[]): string {
  const styleArray: string[] = Object.values(style);
  adds.forEach((x) => {if (x !== undefined) {styleArray.push(x);}});
  return styleArray.filter(x => x !== "").join(" ");
}
function addStyle(style: StylePartial | undefined, key: keyof StyleFull, value: string): StylePartial {
  if (style === undefined) { return addStyle({}, key, value); }
  style[key] = style[key] === "others" ? `${style[key]} ${value}` : value;
  return style;
}
function removeStyle(style: StylePartial | undefined, key: keyof StyleFull): StylePartial {
  if (style === undefined) { return {}; }
  if (Object.hasOwn(style, key)) {
    delete style[key];
  }
  return style;
}
function removeSizeStyle(style: StylePartial | undefined): StylePartial {
  if (style === undefined) { return {}; }
  return removeStyle(style, "size");
}

/********** Event modifier **********/
function once<T extends Element>(func?: (this: T, evt: Event) => void) {
  return function(this: T, evt: Event) {
    if (func !== undefined) { func.call(this, evt); }
    func = undefined;
  };
}
function prevent<T extends Element>(func?: (this: T, evt: Event) => void) {
  return function(this: T, evt: Event) {
    if (func !== undefined) {
      evt.preventDefault();
      func.call(this, evt);
    }
  };
}
function stop<T extends Element>(func?: (this: T, evt: Event) => void) {
  return function(this: T, evt: Event) {
    if (func !== undefined) {
      evt.stopPropagation();
      func.call(this, evt);
    }
  };
}
function self<T extends Element>(func?: (this: T, evt: Event) => void) {
  return function(this: T, evt: Event) {
    if (func !== undefined && evt.target === this) {
      func.call(this, evt);
    }
  };
}
function trusted<T extends Element>(func?: (this: T, evt: Event) => void) {
  return function(this: T, evt: Event) {
    if (func !== undefined && evt.isTrusted) {
      func.call(this, evt);
    }
  };
}

/********** Visual behavior **********/
function scroll<T extends Element>(this: T, evt: Event): void {
  if (!(evt.target instanceof HTMLElement)) { return; }
  const selector = evt.target.getAttribute("href");
  if (!selector) { return; }
  const elem = document.querySelector(selector);
  if (!elem) { return; };
  evt.preventDefault();
  elem.scrollIntoView({
    behavior: "smooth"
  });
}

/********** Utility **********/
function genUUID(): string {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16));
}
function isPlainObject(target: unknown): boolean {
  return (typeof target === "object" && target !== null && target.constructor == Object);
}
function isSnippet(target: unknown, name: string): boolean {
  return typeof target === "function" && target.length === 1 && (target.name === name || target.name === "");
}
function filter<T extends object>(obj: T, keys: string[]): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => keys.includes(key))
  ) as Partial<T>;
}
function iter<T extends Record<string, unknown>>(obj: T): T & Iterable<unknown> {
  interface CustomIterator extends Iterator<unknown> {
    obj: T;
    keys: string[];
    idx: number;
  }

  if (!isPlainObject(obj)) {
    return undefined as unknown as T & Iterable<unknown>;
  }
  const iterableObj = obj as T & { [Symbol.iterator]: () => CustomIterator };
  iterableObj[Symbol.iterator] = function() {
    const iterator: CustomIterator = {
      obj: iterableObj,
      keys: Object.keys(iterableObj),
      idx: 0,
      next() {
        if (this.keys.length < 0) {
          return { done: true } as IteratorResult<unknown>;
        }
        return { value: this.obj[this.keys[this.idx]], done: this.idx++ >= this.keys.length };
      }
    };
    return iterator;
  };
  return iterableObj;
}
function incrementer(initNum: number = 1) {
  let n = initNum - 1;
  function next(): number {
    n += 1;
    return n;
  }
  return next;
}

/********** Async utility **********/
async function sleep(msec: number) {
  return new Promise(resolve => setTimeout(resolve, msec));
}

/********** Export **********/
export {
  // Styling
  getPartsStyle,
  getLayoutStyle,
  mergeStyle,
  getJoinStyle,
  addStyle,
  removeStyle,
  removeSizeStyle,
  // Event modifier
  once,
  prevent,
  stop,
  self,
  trusted,
  // Visual behavior
  scroll,
  // Utility
  genUUID,
  isPlainObject,
  isSnippet,
  filter,
  iter,
  incrementer,
  // Async utility
  sleep,
}
// function mergeStyle(toStyle: StylePartial, fromStyle?: StylePartial): StylePartial {
//   if (fromStyle === undefined) { return toStyle; }
//   const result = {...toStyle};
//   (Object.keys(toStyle) as Array<keyof StyleFull>).forEach(key => {
//     if (Object.hasOwn(fromStyle, key) && isPlainObject(fromStyle[key])) {
//       result[key] = {...toStyle[key], ...fromStyle[key]};
//     }
//   });
//   return result;
// }
// function getJoinStyle(style: StylePartial, ...adds: string[]): string {
//   let result: string[] = [];
//   (Object.keys(style) as Array<keyof StyleFull>).forEach(key => {
//     if (isPlainObject(style[key])) {
//       result = result.concat(Object.values(style[key]!));
//     }
//   });
//   adds.forEach(x => {if (x !== undefined) {result.push(x)}});
//   return result.join(" ");
// }
