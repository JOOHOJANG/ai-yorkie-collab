var rt = Object.defineProperty;
var st = (e, t, n) => t in e ? rt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var P = (e, t, n) => st(e, typeof t != "symbol" ? t + "" : t, n);
import { Document as Ne, Client as Fe, SyncMode as M } from "yorkie-js-sdk";
const ot = 150, Be = {
  type: "paragraph",
  attributes: {
    "@ctype": "paragraph"
  },
  children: [
    {
      type: "node",
      attributes: {
        "@ctype": "textNode"
      },
      children: []
    }
  ]
}, it = {
  type: "component",
  children: [Be],
  attributes: { "@ctype": "text", layout: "default" }
}, at = {
  type: "component",
  attributes: {
    "@ctype": "horizontalLine",
    layout: "line1"
  },
  children: []
};
class Hn {
  constructor(t, n, r, s) {
    P(this, "_gptKey");
    P(this, "_initialized", !1);
    P(this, "_messages", [
      {
        role: "system",
        content: "모든 대답은 한국어로, 최소한 3개의 문단을 포함해야하며, 가능한 길게 대답해야해. 그리고 답변은 사람이 말하는것처럼 하지 말고, 보고서에 정리하는것처럼 해줘."
      }
    ]);
    P(this, "_doc");
    P(this, "_client");
    this._gptKey = t, this._doc = new Ne(n, {
      disableGC: !0
    }), this._client = new Fe(`https://${s}`, {
      apiKey: r
    });
  }
  /** */
  async initialize() {
    if (this._initialized)
      return Promise.resolve();
    try {
      await this._client.activate(), await this._client.attach(this._doc, {
        initialPresence: { userId: "gpt" }
      }), this._initialized = !0;
    } catch {
      return !1;
    }
    return Promise.resolve();
  }
  /**
   *
   */
  async generate(t, n = "", r = 0) {
    n.length && this._messages.push({
      role: "system",
      content: `이제부터 내가 하는 모든 질문은 지금 내가 준 컨텍스트를 베이스에 두고 대답해줘야해. 다음줄부터 컨텍스트를 알려줄게. 
 ${n}`
    });
    const s = await this._fetch(t), { content: o } = s.choices[0].message;
    if (!o.length)
      return;
    this._client.changeSyncMode(this._doc, M.RealtimePushOnly), this._doc.update((f) => {
      f.text.editBulkByPath(
        [r],
        [r],
        [at, it]
      );
    });
    const i = o.split(`
`).flatMap((f) => {
      let g = 0;
      const w = [""];
      for (; g < f.length; )
        w.push(f.slice(g, g + 3)), g += 3;
      return w;
    });
    let c = 1, d = 0, l = 0;
    const u = () => {
      i[c] === "" ? (l++, d = 0, this._doc.update((f) => {
        f.text.editByPath(
          [r + 1, l],
          [r + 1, l],
          Be
        );
      })) : i[c].length && this._doc.update((f, g) => {
        const w = [r + 1, l, 0, d];
        f.text.editByPath(w, w, {
          type: "text",
          value: i[c]
        });
        const h = [
          r + 1,
          l,
          0,
          d + i[c].length
        ];
        g.set({
          selections: [
            f.text.pathRangeToPosRange([h, h])
          ],
          userId: "gpt"
        }), d += i[c].length;
      }), c++, setTimeout(() => {
        if (c < i.length)
          u();
        else
          return this._client.changeSyncMode(this._doc, M.Realtime), this._doc.update((f, g) => {
            g.set({ userId: "gpt" });
          }), Promise.resolve();
      }, ot);
    };
    u();
  }
  async _fetch(t) {
    this._messages.push({ role: "user", content: t });
    const r = await (await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this._gptKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        // 모델 버전 선택
        messages: this._messages,
        temperature: 0.7
        // 생성되는 텍스트의 다양성을 조절하는 파라미터
      })
    })).json();
    return this._messages.push({
      role: "assistant",
      content: r.choices[0].message.content
    }), r;
  }
}
function Le(e, t) {
  return function() {
    return e.apply(t, arguments);
  };
}
const { toString: ct } = Object.prototype, { getPrototypeOf: ue } = Object, W = /* @__PURE__ */ ((e) => (t) => {
  const n = ct.call(t);
  return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), x = (e) => (e = e.toLowerCase(), (t) => W(t) === e), X = (e) => (t) => typeof t === e, { isArray: k } = Array, I = X("undefined");
function lt(e) {
  return e !== null && !I(e) && e.constructor !== null && !I(e.constructor) && A(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
const De = x("ArrayBuffer");
function ut(e) {
  let t;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? t = ArrayBuffer.isView(e) : t = e && e.buffer && De(e.buffer), t;
}
const ft = X("string"), A = X("function"), Ue = X("number"), G = (e) => e !== null && typeof e == "object", dt = (e) => e === !0 || e === !1, J = (e) => {
  if (W(e) !== "object")
    return !1;
  const t = ue(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}, ht = x("Date"), pt = x("File"), mt = x("Blob"), yt = x("FileList"), gt = (e) => G(e) && A(e.pipe), wt = (e) => {
  let t;
  return e && (typeof FormData == "function" && e instanceof FormData || A(e.append) && ((t = W(e)) === "formdata" || // detect form-data instance
  t === "object" && A(e.toString) && e.toString() === "[object FormData]"));
}, bt = x("URLSearchParams"), [Et, St, Rt, Tt] = ["ReadableStream", "Request", "Response", "Headers"].map(x), Ot = (e) => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function H(e, t, { allOwnKeys: n = !1 } = {}) {
  if (e === null || typeof e > "u")
    return;
  let r, s;
  if (typeof e != "object" && (e = [e]), k(e))
    for (r = 0, s = e.length; r < s; r++)
      t.call(null, e[r], r, e);
  else {
    const o = n ? Object.getOwnPropertyNames(e) : Object.keys(e), i = o.length;
    let c;
    for (r = 0; r < i; r++)
      c = o[r], t.call(null, e[c], c, e);
  }
}
function ke(e, t) {
  t = t.toLowerCase();
  const n = Object.keys(e);
  let r = n.length, s;
  for (; r-- > 0; )
    if (s = n[r], t === s.toLowerCase())
      return s;
  return null;
}
const L = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, je = (e) => !I(e) && e !== L;
function re() {
  const { caseless: e } = je(this) && this || {}, t = {}, n = (r, s) => {
    const o = e && ke(t, s) || s;
    J(t[o]) && J(r) ? t[o] = re(t[o], r) : J(r) ? t[o] = re({}, r) : k(r) ? t[o] = r.slice() : t[o] = r;
  };
  for (let r = 0, s = arguments.length; r < s; r++)
    arguments[r] && H(arguments[r], n);
  return t;
}
const _t = (e, t, n, { allOwnKeys: r } = {}) => (H(t, (s, o) => {
  n && A(s) ? e[o] = Le(s, n) : e[o] = s;
}, { allOwnKeys: r }), e), At = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), Pt = (e, t, n, r) => {
  e.prototype = Object.create(t.prototype, r), e.prototype.constructor = e, Object.defineProperty(e, "super", {
    value: t.prototype
  }), n && Object.assign(e.prototype, n);
}, xt = (e, t, n, r) => {
  let s, o, i;
  const c = {};
  if (t = t || {}, e == null) return t;
  do {
    for (s = Object.getOwnPropertyNames(e), o = s.length; o-- > 0; )
      i = s[o], (!r || r(i, e, t)) && !c[i] && (t[i] = e[i], c[i] = !0);
    e = n !== !1 && ue(e);
  } while (e && (!n || n(e, t)) && e !== Object.prototype);
  return t;
}, Ct = (e, t, n) => {
  e = String(e), (n === void 0 || n > e.length) && (n = e.length), n -= t.length;
  const r = e.indexOf(t, n);
  return r !== -1 && r === n;
}, Nt = (e) => {
  if (!e) return null;
  if (k(e)) return e;
  let t = e.length;
  if (!Ue(t)) return null;
  const n = new Array(t);
  for (; t-- > 0; )
    n[t] = e[t];
  return n;
}, Ft = /* @__PURE__ */ ((e) => (t) => e && t instanceof e)(typeof Uint8Array < "u" && ue(Uint8Array)), Bt = (e, t) => {
  const r = (e && e[Symbol.iterator]).call(e);
  let s;
  for (; (s = r.next()) && !s.done; ) {
    const o = s.value;
    t.call(e, o[0], o[1]);
  }
}, Lt = (e, t) => {
  let n;
  const r = [];
  for (; (n = e.exec(t)) !== null; )
    r.push(n);
  return r;
}, Dt = x("HTMLFormElement"), Ut = (e) => e.toLowerCase().replace(
  /[-_\s]([a-z\d])(\w*)/g,
  function(n, r, s) {
    return r.toUpperCase() + s;
  }
), ye = (({ hasOwnProperty: e }) => (t, n) => e.call(t, n))(Object.prototype), kt = x("RegExp"), qe = (e, t) => {
  const n = Object.getOwnPropertyDescriptors(e), r = {};
  H(n, (s, o) => {
    let i;
    (i = t(s, o, e)) !== !1 && (r[o] = i || s);
  }), Object.defineProperties(e, r);
}, jt = (e) => {
  qe(e, (t, n) => {
    if (A(e) && ["arguments", "caller", "callee"].indexOf(n) !== -1)
      return !1;
    const r = e[n];
    if (A(r)) {
      if (t.enumerable = !1, "writable" in t) {
        t.writable = !1;
        return;
      }
      t.set || (t.set = () => {
        throw Error("Can not rewrite read-only method '" + n + "'");
      });
    }
  });
}, qt = (e, t) => {
  const n = {}, r = (s) => {
    s.forEach((o) => {
      n[o] = !0;
    });
  };
  return k(e) ? r(e) : r(String(e).split(t)), n;
}, Mt = () => {
}, It = (e, t) => e != null && Number.isFinite(e = +e) ? e : t, Z = "abcdefghijklmnopqrstuvwxyz", ge = "0123456789", Me = {
  DIGIT: ge,
  ALPHA: Z,
  ALPHA_DIGIT: Z + Z.toUpperCase() + ge
}, Ht = (e = 16, t = Me.ALPHA_DIGIT) => {
  let n = "";
  const { length: r } = t;
  for (; e--; )
    n += t[Math.random() * r | 0];
  return n;
};
function zt(e) {
  return !!(e && A(e.append) && e[Symbol.toStringTag] === "FormData" && e[Symbol.iterator]);
}
const vt = (e) => {
  const t = new Array(10), n = (r, s) => {
    if (G(r)) {
      if (t.indexOf(r) >= 0)
        return;
      if (!("toJSON" in r)) {
        t[s] = r;
        const o = k(r) ? [] : {};
        return H(r, (i, c) => {
          const d = n(i, s + 1);
          !I(d) && (o[c] = d);
        }), t[s] = void 0, o;
      }
    }
    return r;
  };
  return n(e, 0);
}, Jt = x("AsyncFunction"), Kt = (e) => e && (G(e) || A(e)) && A(e.then) && A(e.catch), Ie = ((e, t) => e ? setImmediate : t ? ((n, r) => (L.addEventListener("message", ({ source: s, data: o }) => {
  s === L && o === n && r.length && r.shift()();
}, !1), (s) => {
  r.push(s), L.postMessage(n, "*");
}))(`axios@${Math.random()}`, []) : (n) => setTimeout(n))(
  typeof setImmediate == "function",
  A(L.postMessage)
), $t = typeof queueMicrotask < "u" ? queueMicrotask.bind(L) : typeof process < "u" && process.nextTick || Ie, a = {
  isArray: k,
  isArrayBuffer: De,
  isBuffer: lt,
  isFormData: wt,
  isArrayBufferView: ut,
  isString: ft,
  isNumber: Ue,
  isBoolean: dt,
  isObject: G,
  isPlainObject: J,
  isReadableStream: Et,
  isRequest: St,
  isResponse: Rt,
  isHeaders: Tt,
  isUndefined: I,
  isDate: ht,
  isFile: pt,
  isBlob: mt,
  isRegExp: kt,
  isFunction: A,
  isStream: gt,
  isURLSearchParams: bt,
  isTypedArray: Ft,
  isFileList: yt,
  forEach: H,
  merge: re,
  extend: _t,
  trim: Ot,
  stripBOM: At,
  inherits: Pt,
  toFlatObject: xt,
  kindOf: W,
  kindOfTest: x,
  endsWith: Ct,
  toArray: Nt,
  forEachEntry: Bt,
  matchAll: Lt,
  isHTMLForm: Dt,
  hasOwnProperty: ye,
  hasOwnProp: ye,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: qe,
  freezeMethods: jt,
  toObjectSet: qt,
  toCamelCase: Ut,
  noop: Mt,
  toFiniteNumber: It,
  findKey: ke,
  global: L,
  isContextDefined: je,
  ALPHABET: Me,
  generateString: Ht,
  isSpecCompliantForm: zt,
  toJSONObject: vt,
  isAsyncFn: Jt,
  isThenable: Kt,
  setImmediate: Ie,
  asap: $t
};
function y(e, t, n, r, s) {
  Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = e, this.name = "AxiosError", t && (this.code = t), n && (this.config = n), r && (this.request = r), s && (this.response = s, this.status = s.status ? s.status : null);
}
a.inherits(y, Error, {
  toJSON: function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: a.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
const He = y.prototype, ze = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((e) => {
  ze[e] = { value: e };
});
Object.defineProperties(y, ze);
Object.defineProperty(He, "isAxiosError", { value: !0 });
y.from = (e, t, n, r, s, o) => {
  const i = Object.create(He);
  return a.toFlatObject(e, i, function(d) {
    return d !== Error.prototype;
  }, (c) => c !== "isAxiosError"), y.call(i, e.message, t, n, r, s), i.cause = e, i.name = e.name, o && Object.assign(i, o), i;
};
const Vt = null;
function se(e) {
  return a.isPlainObject(e) || a.isArray(e);
}
function ve(e) {
  return a.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function we(e, t, n) {
  return e ? e.concat(t).map(function(s, o) {
    return s = ve(s), !n && o ? "[" + s + "]" : s;
  }).join(n ? "." : "") : t;
}
function Wt(e) {
  return a.isArray(e) && !e.some(se);
}
const Xt = a.toFlatObject(a, {}, null, function(t) {
  return /^is[A-Z]/.test(t);
});
function Y(e, t, n) {
  if (!a.isObject(e))
    throw new TypeError("target must be an object");
  t = t || new FormData(), n = a.toFlatObject(n, {
    metaTokens: !0,
    dots: !1,
    indexes: !1
  }, !1, function(m, p) {
    return !a.isUndefined(p[m]);
  });
  const r = n.metaTokens, s = n.visitor || u, o = n.dots, i = n.indexes, d = (n.Blob || typeof Blob < "u" && Blob) && a.isSpecCompliantForm(t);
  if (!a.isFunction(s))
    throw new TypeError("visitor must be a function");
  function l(h) {
    if (h === null) return "";
    if (a.isDate(h))
      return h.toISOString();
    if (!d && a.isBlob(h))
      throw new y("Blob is not supported. Use a Buffer instead.");
    return a.isArrayBuffer(h) || a.isTypedArray(h) ? d && typeof Blob == "function" ? new Blob([h]) : Buffer.from(h) : h;
  }
  function u(h, m, p) {
    let b = h;
    if (h && !p && typeof h == "object") {
      if (a.endsWith(m, "{}"))
        m = r ? m : m.slice(0, -2), h = JSON.stringify(h);
      else if (a.isArray(h) && Wt(h) || (a.isFileList(h) || a.endsWith(m, "[]")) && (b = a.toArray(h)))
        return m = ve(m), b.forEach(function(R, C) {
          !(a.isUndefined(R) || R === null) && t.append(
            // eslint-disable-next-line no-nested-ternary
            i === !0 ? we([m], C, o) : i === null ? m : m + "[]",
            l(R)
          );
        }), !1;
    }
    return se(h) ? !0 : (t.append(we(p, m, o), l(h)), !1);
  }
  const f = [], g = Object.assign(Xt, {
    defaultVisitor: u,
    convertValue: l,
    isVisitable: se
  });
  function w(h, m) {
    if (!a.isUndefined(h)) {
      if (f.indexOf(h) !== -1)
        throw Error("Circular reference detected in " + m.join("."));
      f.push(h), a.forEach(h, function(b, E) {
        (!(a.isUndefined(b) || b === null) && s.call(
          t,
          b,
          a.isString(E) ? E.trim() : E,
          m,
          g
        )) === !0 && w(b, m ? m.concat(E) : [E]);
      }), f.pop();
    }
  }
  if (!a.isObject(e))
    throw new TypeError("data must be an object");
  return w(e), t;
}
function be(e) {
  const t = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function(r) {
    return t[r];
  });
}
function fe(e, t) {
  this._pairs = [], e && Y(e, this, t);
}
const Je = fe.prototype;
Je.append = function(t, n) {
  this._pairs.push([t, n]);
};
Je.toString = function(t) {
  const n = t ? function(r) {
    return t.call(this, r, be);
  } : be;
  return this._pairs.map(function(s) {
    return n(s[0]) + "=" + n(s[1]);
  }, "").join("&");
};
function Gt(e) {
  return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function Ke(e, t, n) {
  if (!t)
    return e;
  const r = n && n.encode || Gt, s = n && n.serialize;
  let o;
  if (s ? o = s(t, n) : o = a.isURLSearchParams(t) ? t.toString() : new fe(t, n).toString(r), o) {
    const i = e.indexOf("#");
    i !== -1 && (e = e.slice(0, i)), e += (e.indexOf("?") === -1 ? "?" : "&") + o;
  }
  return e;
}
class Ee {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(t, n, r) {
    return this.handlers.push({
      fulfilled: t,
      rejected: n,
      synchronous: r ? r.synchronous : !1,
      runWhen: r ? r.runWhen : null
    }), this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(t) {
    this.handlers[t] && (this.handlers[t] = null);
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    this.handlers && (this.handlers = []);
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(t) {
    a.forEach(this.handlers, function(r) {
      r !== null && t(r);
    });
  }
}
const $e = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, Yt = typeof URLSearchParams < "u" ? URLSearchParams : fe, Qt = typeof FormData < "u" ? FormData : null, Zt = typeof Blob < "u" ? Blob : null, en = {
  isBrowser: !0,
  classes: {
    URLSearchParams: Yt,
    FormData: Qt,
    Blob: Zt
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
}, de = typeof window < "u" && typeof document < "u", oe = typeof navigator == "object" && navigator || void 0, tn = de && (!oe || ["ReactNative", "NativeScript", "NS"].indexOf(oe.product) < 0), nn = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", rn = de && window.location.href || "http://localhost", sn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: de,
  hasStandardBrowserEnv: tn,
  hasStandardBrowserWebWorkerEnv: nn,
  navigator: oe,
  origin: rn
}, Symbol.toStringTag, { value: "Module" })), O = {
  ...sn,
  ...en
};
function on(e, t) {
  return Y(e, new O.classes.URLSearchParams(), Object.assign({
    visitor: function(n, r, s, o) {
      return O.isNode && a.isBuffer(n) ? (this.append(r, n.toString("base64")), !1) : o.defaultVisitor.apply(this, arguments);
    }
  }, t));
}
function an(e) {
  return a.matchAll(/\w+|\[(\w*)]/g, e).map((t) => t[0] === "[]" ? "" : t[1] || t[0]);
}
function cn(e) {
  const t = {}, n = Object.keys(e);
  let r;
  const s = n.length;
  let o;
  for (r = 0; r < s; r++)
    o = n[r], t[o] = e[o];
  return t;
}
function Ve(e) {
  function t(n, r, s, o) {
    let i = n[o++];
    if (i === "__proto__") return !0;
    const c = Number.isFinite(+i), d = o >= n.length;
    return i = !i && a.isArray(s) ? s.length : i, d ? (a.hasOwnProp(s, i) ? s[i] = [s[i], r] : s[i] = r, !c) : ((!s[i] || !a.isObject(s[i])) && (s[i] = []), t(n, r, s[i], o) && a.isArray(s[i]) && (s[i] = cn(s[i])), !c);
  }
  if (a.isFormData(e) && a.isFunction(e.entries)) {
    const n = {};
    return a.forEachEntry(e, (r, s) => {
      t(an(r), s, n, 0);
    }), n;
  }
  return null;
}
function ln(e, t, n) {
  if (a.isString(e))
    try {
      return (t || JSON.parse)(e), a.trim(e);
    } catch (r) {
      if (r.name !== "SyntaxError")
        throw r;
    }
  return (0, JSON.stringify)(e);
}
const z = {
  transitional: $e,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function(t, n) {
    const r = n.getContentType() || "", s = r.indexOf("application/json") > -1, o = a.isObject(t);
    if (o && a.isHTMLForm(t) && (t = new FormData(t)), a.isFormData(t))
      return s ? JSON.stringify(Ve(t)) : t;
    if (a.isArrayBuffer(t) || a.isBuffer(t) || a.isStream(t) || a.isFile(t) || a.isBlob(t) || a.isReadableStream(t))
      return t;
    if (a.isArrayBufferView(t))
      return t.buffer;
    if (a.isURLSearchParams(t))
      return n.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), t.toString();
    let c;
    if (o) {
      if (r.indexOf("application/x-www-form-urlencoded") > -1)
        return on(t, this.formSerializer).toString();
      if ((c = a.isFileList(t)) || r.indexOf("multipart/form-data") > -1) {
        const d = this.env && this.env.FormData;
        return Y(
          c ? { "files[]": t } : t,
          d && new d(),
          this.formSerializer
        );
      }
    }
    return o || s ? (n.setContentType("application/json", !1), ln(t)) : t;
  }],
  transformResponse: [function(t) {
    const n = this.transitional || z.transitional, r = n && n.forcedJSONParsing, s = this.responseType === "json";
    if (a.isResponse(t) || a.isReadableStream(t))
      return t;
    if (t && a.isString(t) && (r && !this.responseType || s)) {
      const i = !(n && n.silentJSONParsing) && s;
      try {
        return JSON.parse(t);
      } catch (c) {
        if (i)
          throw c.name === "SyntaxError" ? y.from(c, y.ERR_BAD_RESPONSE, this, null, this.response) : c;
      }
    }
    return t;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: O.classes.FormData,
    Blob: O.classes.Blob
  },
  validateStatus: function(t) {
    return t >= 200 && t < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
a.forEach(["delete", "get", "head", "post", "put", "patch"], (e) => {
  z.headers[e] = {};
});
const un = a.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]), fn = (e) => {
  const t = {};
  let n, r, s;
  return e && e.split(`
`).forEach(function(i) {
    s = i.indexOf(":"), n = i.substring(0, s).trim().toLowerCase(), r = i.substring(s + 1).trim(), !(!n || t[n] && un[n]) && (n === "set-cookie" ? t[n] ? t[n].push(r) : t[n] = [r] : t[n] = t[n] ? t[n] + ", " + r : r);
  }), t;
}, Se = Symbol("internals");
function q(e) {
  return e && String(e).trim().toLowerCase();
}
function K(e) {
  return e === !1 || e == null ? e : a.isArray(e) ? e.map(K) : String(e);
}
function dn(e) {
  const t = /* @__PURE__ */ Object.create(null), n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let r;
  for (; r = n.exec(e); )
    t[r[1]] = r[2];
  return t;
}
const hn = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function ee(e, t, n, r, s) {
  if (a.isFunction(r))
    return r.call(this, t, n);
  if (s && (t = n), !!a.isString(t)) {
    if (a.isString(r))
      return t.indexOf(r) !== -1;
    if (a.isRegExp(r))
      return r.test(t);
  }
}
function pn(e) {
  return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (t, n, r) => n.toUpperCase() + r);
}
function mn(e, t) {
  const n = a.toCamelCase(" " + t);
  ["get", "set", "has"].forEach((r) => {
    Object.defineProperty(e, r + n, {
      value: function(s, o, i) {
        return this[r].call(this, t, s, o, i);
      },
      configurable: !0
    });
  });
}
class _ {
  constructor(t) {
    t && this.set(t);
  }
  set(t, n, r) {
    const s = this;
    function o(c, d, l) {
      const u = q(d);
      if (!u)
        throw new Error("header name must be a non-empty string");
      const f = a.findKey(s, u);
      (!f || s[f] === void 0 || l === !0 || l === void 0 && s[f] !== !1) && (s[f || d] = K(c));
    }
    const i = (c, d) => a.forEach(c, (l, u) => o(l, u, d));
    if (a.isPlainObject(t) || t instanceof this.constructor)
      i(t, n);
    else if (a.isString(t) && (t = t.trim()) && !hn(t))
      i(fn(t), n);
    else if (a.isHeaders(t))
      for (const [c, d] of t.entries())
        o(d, c, r);
    else
      t != null && o(n, t, r);
    return this;
  }
  get(t, n) {
    if (t = q(t), t) {
      const r = a.findKey(this, t);
      if (r) {
        const s = this[r];
        if (!n)
          return s;
        if (n === !0)
          return dn(s);
        if (a.isFunction(n))
          return n.call(this, s, r);
        if (a.isRegExp(n))
          return n.exec(s);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(t, n) {
    if (t = q(t), t) {
      const r = a.findKey(this, t);
      return !!(r && this[r] !== void 0 && (!n || ee(this, this[r], r, n)));
    }
    return !1;
  }
  delete(t, n) {
    const r = this;
    let s = !1;
    function o(i) {
      if (i = q(i), i) {
        const c = a.findKey(r, i);
        c && (!n || ee(r, r[c], c, n)) && (delete r[c], s = !0);
      }
    }
    return a.isArray(t) ? t.forEach(o) : o(t), s;
  }
  clear(t) {
    const n = Object.keys(this);
    let r = n.length, s = !1;
    for (; r--; ) {
      const o = n[r];
      (!t || ee(this, this[o], o, t, !0)) && (delete this[o], s = !0);
    }
    return s;
  }
  normalize(t) {
    const n = this, r = {};
    return a.forEach(this, (s, o) => {
      const i = a.findKey(r, o);
      if (i) {
        n[i] = K(s), delete n[o];
        return;
      }
      const c = t ? pn(o) : String(o).trim();
      c !== o && delete n[o], n[c] = K(s), r[c] = !0;
    }), this;
  }
  concat(...t) {
    return this.constructor.concat(this, ...t);
  }
  toJSON(t) {
    const n = /* @__PURE__ */ Object.create(null);
    return a.forEach(this, (r, s) => {
      r != null && r !== !1 && (n[s] = t && a.isArray(r) ? r.join(", ") : r);
    }), n;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([t, n]) => t + ": " + n).join(`
`);
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(t) {
    return t instanceof this ? t : new this(t);
  }
  static concat(t, ...n) {
    const r = new this(t);
    return n.forEach((s) => r.set(s)), r;
  }
  static accessor(t) {
    const r = (this[Se] = this[Se] = {
      accessors: {}
    }).accessors, s = this.prototype;
    function o(i) {
      const c = q(i);
      r[c] || (mn(s, i), r[c] = !0);
    }
    return a.isArray(t) ? t.forEach(o) : o(t), this;
  }
}
_.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
a.reduceDescriptors(_.prototype, ({ value: e }, t) => {
  let n = t[0].toUpperCase() + t.slice(1);
  return {
    get: () => e,
    set(r) {
      this[n] = r;
    }
  };
});
a.freezeMethods(_);
function te(e, t) {
  const n = this || z, r = t || n, s = _.from(r.headers);
  let o = r.data;
  return a.forEach(e, function(c) {
    o = c.call(n, o, s.normalize(), t ? t.status : void 0);
  }), s.normalize(), o;
}
function We(e) {
  return !!(e && e.__CANCEL__);
}
function j(e, t, n) {
  y.call(this, e ?? "canceled", y.ERR_CANCELED, t, n), this.name = "CanceledError";
}
a.inherits(j, y, {
  __CANCEL__: !0
});
function Xe(e, t, n) {
  const r = n.config.validateStatus;
  !n.status || !r || r(n.status) ? e(n) : t(new y(
    "Request failed with status code " + n.status,
    [y.ERR_BAD_REQUEST, y.ERR_BAD_RESPONSE][Math.floor(n.status / 100) - 4],
    n.config,
    n.request,
    n
  ));
}
function yn(e) {
  const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
  return t && t[1] || "";
}
function gn(e, t) {
  e = e || 10;
  const n = new Array(e), r = new Array(e);
  let s = 0, o = 0, i;
  return t = t !== void 0 ? t : 1e3, function(d) {
    const l = Date.now(), u = r[o];
    i || (i = l), n[s] = d, r[s] = l;
    let f = o, g = 0;
    for (; f !== s; )
      g += n[f++], f = f % e;
    if (s = (s + 1) % e, s === o && (o = (o + 1) % e), l - i < t)
      return;
    const w = u && l - u;
    return w ? Math.round(g * 1e3 / w) : void 0;
  };
}
function wn(e, t) {
  let n = 0, r = 1e3 / t, s, o;
  const i = (l, u = Date.now()) => {
    n = u, s = null, o && (clearTimeout(o), o = null), e.apply(null, l);
  };
  return [(...l) => {
    const u = Date.now(), f = u - n;
    f >= r ? i(l, u) : (s = l, o || (o = setTimeout(() => {
      o = null, i(s);
    }, r - f)));
  }, () => s && i(s)];
}
const $ = (e, t, n = 3) => {
  let r = 0;
  const s = gn(50, 250);
  return wn((o) => {
    const i = o.loaded, c = o.lengthComputable ? o.total : void 0, d = i - r, l = s(d), u = i <= c;
    r = i;
    const f = {
      loaded: i,
      total: c,
      progress: c ? i / c : void 0,
      bytes: d,
      rate: l || void 0,
      estimated: l && c && u ? (c - i) / l : void 0,
      event: o,
      lengthComputable: c != null,
      [t ? "download" : "upload"]: !0
    };
    e(f);
  }, n);
}, Re = (e, t) => {
  const n = e != null;
  return [(r) => t[0]({
    lengthComputable: n,
    total: e,
    loaded: r
  }), t[1]];
}, Te = (e) => (...t) => a.asap(() => e(...t)), bn = O.hasStandardBrowserEnv ? (
  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  function() {
    const t = O.navigator && /(msie|trident)/i.test(O.navigator.userAgent), n = document.createElement("a");
    let r;
    function s(o) {
      let i = o;
      return t && (n.setAttribute("href", i), i = n.href), n.setAttribute("href", i), {
        href: n.href,
        protocol: n.protocol ? n.protocol.replace(/:$/, "") : "",
        host: n.host,
        search: n.search ? n.search.replace(/^\?/, "") : "",
        hash: n.hash ? n.hash.replace(/^#/, "") : "",
        hostname: n.hostname,
        port: n.port,
        pathname: n.pathname.charAt(0) === "/" ? n.pathname : "/" + n.pathname
      };
    }
    return r = s(window.location.href), function(i) {
      const c = a.isString(i) ? s(i) : i;
      return c.protocol === r.protocol && c.host === r.host;
    };
  }()
) : (
  // Non standard browser envs (web workers, react-native) lack needed support.
  /* @__PURE__ */ function() {
    return function() {
      return !0;
    };
  }()
), En = O.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(e, t, n, r, s, o) {
      const i = [e + "=" + encodeURIComponent(t)];
      a.isNumber(n) && i.push("expires=" + new Date(n).toGMTString()), a.isString(r) && i.push("path=" + r), a.isString(s) && i.push("domain=" + s), o === !0 && i.push("secure"), document.cookie = i.join("; ");
    },
    read(e) {
      const t = document.cookie.match(new RegExp("(^|;\\s*)(" + e + ")=([^;]*)"));
      return t ? decodeURIComponent(t[3]) : null;
    },
    remove(e) {
      this.write(e, "", Date.now() - 864e5);
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
);
function Sn(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function Rn(e, t) {
  return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
function Ge(e, t) {
  return e && !Sn(t) ? Rn(e, t) : t;
}
const Oe = (e) => e instanceof _ ? { ...e } : e;
function U(e, t) {
  t = t || {};
  const n = {};
  function r(l, u, f) {
    return a.isPlainObject(l) && a.isPlainObject(u) ? a.merge.call({ caseless: f }, l, u) : a.isPlainObject(u) ? a.merge({}, u) : a.isArray(u) ? u.slice() : u;
  }
  function s(l, u, f) {
    if (a.isUndefined(u)) {
      if (!a.isUndefined(l))
        return r(void 0, l, f);
    } else return r(l, u, f);
  }
  function o(l, u) {
    if (!a.isUndefined(u))
      return r(void 0, u);
  }
  function i(l, u) {
    if (a.isUndefined(u)) {
      if (!a.isUndefined(l))
        return r(void 0, l);
    } else return r(void 0, u);
  }
  function c(l, u, f) {
    if (f in t)
      return r(l, u);
    if (f in e)
      return r(void 0, l);
  }
  const d = {
    url: o,
    method: o,
    data: o,
    baseURL: i,
    transformRequest: i,
    transformResponse: i,
    paramsSerializer: i,
    timeout: i,
    timeoutMessage: i,
    withCredentials: i,
    withXSRFToken: i,
    adapter: i,
    responseType: i,
    xsrfCookieName: i,
    xsrfHeaderName: i,
    onUploadProgress: i,
    onDownloadProgress: i,
    decompress: i,
    maxContentLength: i,
    maxBodyLength: i,
    beforeRedirect: i,
    transport: i,
    httpAgent: i,
    httpsAgent: i,
    cancelToken: i,
    socketPath: i,
    responseEncoding: i,
    validateStatus: c,
    headers: (l, u) => s(Oe(l), Oe(u), !0)
  };
  return a.forEach(Object.keys(Object.assign({}, e, t)), function(u) {
    const f = d[u] || s, g = f(e[u], t[u], u);
    a.isUndefined(g) && f !== c || (n[u] = g);
  }), n;
}
const Ye = (e) => {
  const t = U({}, e);
  let { data: n, withXSRFToken: r, xsrfHeaderName: s, xsrfCookieName: o, headers: i, auth: c } = t;
  t.headers = i = _.from(i), t.url = Ke(Ge(t.baseURL, t.url), e.params, e.paramsSerializer), c && i.set(
    "Authorization",
    "Basic " + btoa((c.username || "") + ":" + (c.password ? unescape(encodeURIComponent(c.password)) : ""))
  );
  let d;
  if (a.isFormData(n)) {
    if (O.hasStandardBrowserEnv || O.hasStandardBrowserWebWorkerEnv)
      i.setContentType(void 0);
    else if ((d = i.getContentType()) !== !1) {
      const [l, ...u] = d ? d.split(";").map((f) => f.trim()).filter(Boolean) : [];
      i.setContentType([l || "multipart/form-data", ...u].join("; "));
    }
  }
  if (O.hasStandardBrowserEnv && (r && a.isFunction(r) && (r = r(t)), r || r !== !1 && bn(t.url))) {
    const l = s && o && En.read(o);
    l && i.set(s, l);
  }
  return t;
}, Tn = typeof XMLHttpRequest < "u", On = Tn && function(e) {
  return new Promise(function(n, r) {
    const s = Ye(e);
    let o = s.data;
    const i = _.from(s.headers).normalize();
    let { responseType: c, onUploadProgress: d, onDownloadProgress: l } = s, u, f, g, w, h;
    function m() {
      w && w(), h && h(), s.cancelToken && s.cancelToken.unsubscribe(u), s.signal && s.signal.removeEventListener("abort", u);
    }
    let p = new XMLHttpRequest();
    p.open(s.method.toUpperCase(), s.url, !0), p.timeout = s.timeout;
    function b() {
      if (!p)
        return;
      const R = _.from(
        "getAllResponseHeaders" in p && p.getAllResponseHeaders()
      ), T = {
        data: !c || c === "text" || c === "json" ? p.responseText : p.response,
        status: p.status,
        statusText: p.statusText,
        headers: R,
        config: e,
        request: p
      };
      Xe(function(B) {
        n(B), m();
      }, function(B) {
        r(B), m();
      }, T), p = null;
    }
    "onloadend" in p ? p.onloadend = b : p.onreadystatechange = function() {
      !p || p.readyState !== 4 || p.status === 0 && !(p.responseURL && p.responseURL.indexOf("file:") === 0) || setTimeout(b);
    }, p.onabort = function() {
      p && (r(new y("Request aborted", y.ECONNABORTED, e, p)), p = null);
    }, p.onerror = function() {
      r(new y("Network Error", y.ERR_NETWORK, e, p)), p = null;
    }, p.ontimeout = function() {
      let C = s.timeout ? "timeout of " + s.timeout + "ms exceeded" : "timeout exceeded";
      const T = s.transitional || $e;
      s.timeoutErrorMessage && (C = s.timeoutErrorMessage), r(new y(
        C,
        T.clarifyTimeoutError ? y.ETIMEDOUT : y.ECONNABORTED,
        e,
        p
      )), p = null;
    }, o === void 0 && i.setContentType(null), "setRequestHeader" in p && a.forEach(i.toJSON(), function(C, T) {
      p.setRequestHeader(T, C);
    }), a.isUndefined(s.withCredentials) || (p.withCredentials = !!s.withCredentials), c && c !== "json" && (p.responseType = s.responseType), l && ([g, h] = $(l, !0), p.addEventListener("progress", g)), d && p.upload && ([f, w] = $(d), p.upload.addEventListener("progress", f), p.upload.addEventListener("loadend", w)), (s.cancelToken || s.signal) && (u = (R) => {
      p && (r(!R || R.type ? new j(null, e, p) : R), p.abort(), p = null);
    }, s.cancelToken && s.cancelToken.subscribe(u), s.signal && (s.signal.aborted ? u() : s.signal.addEventListener("abort", u)));
    const E = yn(s.url);
    if (E && O.protocols.indexOf(E) === -1) {
      r(new y("Unsupported protocol " + E + ":", y.ERR_BAD_REQUEST, e));
      return;
    }
    p.send(o || null);
  });
}, _n = (e, t) => {
  const { length: n } = e = e ? e.filter(Boolean) : [];
  if (t || n) {
    let r = new AbortController(), s;
    const o = function(l) {
      if (!s) {
        s = !0, c();
        const u = l instanceof Error ? l : this.reason;
        r.abort(u instanceof y ? u : new j(u instanceof Error ? u.message : u));
      }
    };
    let i = t && setTimeout(() => {
      i = null, o(new y(`timeout ${t} of ms exceeded`, y.ETIMEDOUT));
    }, t);
    const c = () => {
      e && (i && clearTimeout(i), i = null, e.forEach((l) => {
        l.unsubscribe ? l.unsubscribe(o) : l.removeEventListener("abort", o);
      }), e = null);
    };
    e.forEach((l) => l.addEventListener("abort", o));
    const { signal: d } = r;
    return d.unsubscribe = () => a.asap(c), d;
  }
}, An = function* (e, t) {
  let n = e.byteLength;
  if (n < t) {
    yield e;
    return;
  }
  let r = 0, s;
  for (; r < n; )
    s = r + t, yield e.slice(r, s), r = s;
}, Pn = async function* (e, t) {
  for await (const n of xn(e))
    yield* An(n, t);
}, xn = async function* (e) {
  if (e[Symbol.asyncIterator]) {
    yield* e;
    return;
  }
  const t = e.getReader();
  try {
    for (; ; ) {
      const { done: n, value: r } = await t.read();
      if (n)
        break;
      yield r;
    }
  } finally {
    await t.cancel();
  }
}, _e = (e, t, n, r) => {
  const s = Pn(e, t);
  let o = 0, i, c = (d) => {
    i || (i = !0, r && r(d));
  };
  return new ReadableStream({
    async pull(d) {
      try {
        const { done: l, value: u } = await s.next();
        if (l) {
          c(), d.close();
          return;
        }
        let f = u.byteLength;
        if (n) {
          let g = o += f;
          n(g);
        }
        d.enqueue(new Uint8Array(u));
      } catch (l) {
        throw c(l), l;
      }
    },
    cancel(d) {
      return c(d), s.return();
    }
  }, {
    highWaterMark: 2
  });
}, Q = typeof fetch == "function" && typeof Request == "function" && typeof Response == "function", Qe = Q && typeof ReadableStream == "function", Cn = Q && (typeof TextEncoder == "function" ? /* @__PURE__ */ ((e) => (t) => e.encode(t))(new TextEncoder()) : async (e) => new Uint8Array(await new Response(e).arrayBuffer())), Ze = (e, ...t) => {
  try {
    return !!e(...t);
  } catch {
    return !1;
  }
}, Nn = Qe && Ze(() => {
  let e = !1;
  const t = new Request(O.origin, {
    body: new ReadableStream(),
    method: "POST",
    get duplex() {
      return e = !0, "half";
    }
  }).headers.has("Content-Type");
  return e && !t;
}), Ae = 64 * 1024, ie = Qe && Ze(() => a.isReadableStream(new Response("").body)), V = {
  stream: ie && ((e) => e.body)
};
Q && ((e) => {
  ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((t) => {
    !V[t] && (V[t] = a.isFunction(e[t]) ? (n) => n[t]() : (n, r) => {
      throw new y(`Response type '${t}' is not supported`, y.ERR_NOT_SUPPORT, r);
    });
  });
})(new Response());
const Fn = async (e) => {
  if (e == null)
    return 0;
  if (a.isBlob(e))
    return e.size;
  if (a.isSpecCompliantForm(e))
    return (await new Request(O.origin, {
      method: "POST",
      body: e
    }).arrayBuffer()).byteLength;
  if (a.isArrayBufferView(e) || a.isArrayBuffer(e))
    return e.byteLength;
  if (a.isURLSearchParams(e) && (e = e + ""), a.isString(e))
    return (await Cn(e)).byteLength;
}, Bn = async (e, t) => {
  const n = a.toFiniteNumber(e.getContentLength());
  return n ?? Fn(t);
}, Ln = Q && (async (e) => {
  let {
    url: t,
    method: n,
    data: r,
    signal: s,
    cancelToken: o,
    timeout: i,
    onDownloadProgress: c,
    onUploadProgress: d,
    responseType: l,
    headers: u,
    withCredentials: f = "same-origin",
    fetchOptions: g
  } = Ye(e);
  l = l ? (l + "").toLowerCase() : "text";
  let w = _n([s, o && o.toAbortSignal()], i), h;
  const m = w && w.unsubscribe && (() => {
    w.unsubscribe();
  });
  let p;
  try {
    if (d && Nn && n !== "get" && n !== "head" && (p = await Bn(u, r)) !== 0) {
      let T = new Request(t, {
        method: "POST",
        body: r,
        duplex: "half"
      }), N;
      if (a.isFormData(r) && (N = T.headers.get("content-type")) && u.setContentType(N), T.body) {
        const [B, v] = Re(
          p,
          $(Te(d))
        );
        r = _e(T.body, Ae, B, v);
      }
    }
    a.isString(f) || (f = f ? "include" : "omit");
    const b = "credentials" in Request.prototype;
    h = new Request(t, {
      ...g,
      signal: w,
      method: n.toUpperCase(),
      headers: u.normalize().toJSON(),
      body: r,
      duplex: "half",
      credentials: b ? f : void 0
    });
    let E = await fetch(h);
    const R = ie && (l === "stream" || l === "response");
    if (ie && (c || R && m)) {
      const T = {};
      ["status", "statusText", "headers"].forEach((me) => {
        T[me] = E[me];
      });
      const N = a.toFiniteNumber(E.headers.get("content-length")), [B, v] = c && Re(
        N,
        $(Te(c), !0)
      ) || [];
      E = new Response(
        _e(E.body, Ae, B, () => {
          v && v(), m && m();
        }),
        T
      );
    }
    l = l || "text";
    let C = await V[a.findKey(V, l) || "text"](E, e);
    return !R && m && m(), await new Promise((T, N) => {
      Xe(T, N, {
        data: C,
        headers: _.from(E.headers),
        status: E.status,
        statusText: E.statusText,
        config: e,
        request: h
      });
    });
  } catch (b) {
    throw m && m(), b && b.name === "TypeError" && /fetch/i.test(b.message) ? Object.assign(
      new y("Network Error", y.ERR_NETWORK, e, h),
      {
        cause: b.cause || b
      }
    ) : y.from(b, b && b.code, e, h);
  }
}), ae = {
  http: Vt,
  xhr: On,
  fetch: Ln
};
a.forEach(ae, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, "name", { value: t });
    } catch {
    }
    Object.defineProperty(e, "adapterName", { value: t });
  }
});
const Pe = (e) => `- ${e}`, Dn = (e) => a.isFunction(e) || e === null || e === !1, et = {
  getAdapter: (e) => {
    e = a.isArray(e) ? e : [e];
    const { length: t } = e;
    let n, r;
    const s = {};
    for (let o = 0; o < t; o++) {
      n = e[o];
      let i;
      if (r = n, !Dn(n) && (r = ae[(i = String(n)).toLowerCase()], r === void 0))
        throw new y(`Unknown adapter '${i}'`);
      if (r)
        break;
      s[i || "#" + o] = r;
    }
    if (!r) {
      const o = Object.entries(s).map(
        ([c, d]) => `adapter ${c} ` + (d === !1 ? "is not supported by the environment" : "is not available in the build")
      );
      let i = t ? o.length > 1 ? `since :
` + o.map(Pe).join(`
`) : " " + Pe(o[0]) : "as no adapter specified";
      throw new y(
        "There is no suitable adapter to dispatch the request " + i,
        "ERR_NOT_SUPPORT"
      );
    }
    return r;
  },
  adapters: ae
};
function ne(e) {
  if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)
    throw new j(null, e);
}
function xe(e) {
  return ne(e), e.headers = _.from(e.headers), e.data = te.call(
    e,
    e.transformRequest
  ), ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), et.getAdapter(e.adapter || z.adapter)(e).then(function(r) {
    return ne(e), r.data = te.call(
      e,
      e.transformResponse,
      r
    ), r.headers = _.from(r.headers), r;
  }, function(r) {
    return We(r) || (ne(e), r && r.response && (r.response.data = te.call(
      e,
      e.transformResponse,
      r.response
    ), r.response.headers = _.from(r.response.headers))), Promise.reject(r);
  });
}
const tt = "1.7.7", he = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((e, t) => {
  he[e] = function(r) {
    return typeof r === e || "a" + (t < 1 ? "n " : " ") + e;
  };
});
const Ce = {};
he.transitional = function(t, n, r) {
  function s(o, i) {
    return "[Axios v" + tt + "] Transitional option '" + o + "'" + i + (r ? ". " + r : "");
  }
  return (o, i, c) => {
    if (t === !1)
      throw new y(
        s(i, " has been removed" + (n ? " in " + n : "")),
        y.ERR_DEPRECATED
      );
    return n && !Ce[i] && (Ce[i] = !0, console.warn(
      s(
        i,
        " has been deprecated since v" + n + " and will be removed in the near future"
      )
    )), t ? t(o, i, c) : !0;
  };
};
function Un(e, t, n) {
  if (typeof e != "object")
    throw new y("options must be an object", y.ERR_BAD_OPTION_VALUE);
  const r = Object.keys(e);
  let s = r.length;
  for (; s-- > 0; ) {
    const o = r[s], i = t[o];
    if (i) {
      const c = e[o], d = c === void 0 || i(c, o, e);
      if (d !== !0)
        throw new y("option " + o + " must be " + d, y.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (n !== !0)
      throw new y("Unknown option " + o, y.ERR_BAD_OPTION);
  }
}
const ce = {
  assertOptions: Un,
  validators: he
}, F = ce.validators;
class D {
  constructor(t) {
    this.defaults = t, this.interceptors = {
      request: new Ee(),
      response: new Ee()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(t, n) {
    try {
      return await this._request(t, n);
    } catch (r) {
      if (r instanceof Error) {
        let s;
        Error.captureStackTrace ? Error.captureStackTrace(s = {}) : s = new Error();
        const o = s.stack ? s.stack.replace(/^.+\n/, "") : "";
        try {
          r.stack ? o && !String(r.stack).endsWith(o.replace(/^.+\n.+\n/, "")) && (r.stack += `
` + o) : r.stack = o;
        } catch {
        }
      }
      throw r;
    }
  }
  _request(t, n) {
    typeof t == "string" ? (n = n || {}, n.url = t) : n = t || {}, n = U(this.defaults, n);
    const { transitional: r, paramsSerializer: s, headers: o } = n;
    r !== void 0 && ce.assertOptions(r, {
      silentJSONParsing: F.transitional(F.boolean),
      forcedJSONParsing: F.transitional(F.boolean),
      clarifyTimeoutError: F.transitional(F.boolean)
    }, !1), s != null && (a.isFunction(s) ? n.paramsSerializer = {
      serialize: s
    } : ce.assertOptions(s, {
      encode: F.function,
      serialize: F.function
    }, !0)), n.method = (n.method || this.defaults.method || "get").toLowerCase();
    let i = o && a.merge(
      o.common,
      o[n.method]
    );
    o && a.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (h) => {
        delete o[h];
      }
    ), n.headers = _.concat(i, o);
    const c = [];
    let d = !0;
    this.interceptors.request.forEach(function(m) {
      typeof m.runWhen == "function" && m.runWhen(n) === !1 || (d = d && m.synchronous, c.unshift(m.fulfilled, m.rejected));
    });
    const l = [];
    this.interceptors.response.forEach(function(m) {
      l.push(m.fulfilled, m.rejected);
    });
    let u, f = 0, g;
    if (!d) {
      const h = [xe.bind(this), void 0];
      for (h.unshift.apply(h, c), h.push.apply(h, l), g = h.length, u = Promise.resolve(n); f < g; )
        u = u.then(h[f++], h[f++]);
      return u;
    }
    g = c.length;
    let w = n;
    for (f = 0; f < g; ) {
      const h = c[f++], m = c[f++];
      try {
        w = h(w);
      } catch (p) {
        m.call(this, p);
        break;
      }
    }
    try {
      u = xe.call(this, w);
    } catch (h) {
      return Promise.reject(h);
    }
    for (f = 0, g = l.length; f < g; )
      u = u.then(l[f++], l[f++]);
    return u;
  }
  getUri(t) {
    t = U(this.defaults, t);
    const n = Ge(t.baseURL, t.url);
    return Ke(n, t.params, t.paramsSerializer);
  }
}
a.forEach(["delete", "get", "head", "options"], function(t) {
  D.prototype[t] = function(n, r) {
    return this.request(U(r || {}, {
      method: t,
      url: n,
      data: (r || {}).data
    }));
  };
});
a.forEach(["post", "put", "patch"], function(t) {
  function n(r) {
    return function(o, i, c) {
      return this.request(U(c || {}, {
        method: t,
        headers: r ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: o,
        data: i
      }));
    };
  }
  D.prototype[t] = n(), D.prototype[t + "Form"] = n(!0);
});
class pe {
  constructor(t) {
    if (typeof t != "function")
      throw new TypeError("executor must be a function.");
    let n;
    this.promise = new Promise(function(o) {
      n = o;
    });
    const r = this;
    this.promise.then((s) => {
      if (!r._listeners) return;
      let o = r._listeners.length;
      for (; o-- > 0; )
        r._listeners[o](s);
      r._listeners = null;
    }), this.promise.then = (s) => {
      let o;
      const i = new Promise((c) => {
        r.subscribe(c), o = c;
      }).then(s);
      return i.cancel = function() {
        r.unsubscribe(o);
      }, i;
    }, t(function(o, i, c) {
      r.reason || (r.reason = new j(o, i, c), n(r.reason));
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason)
      throw this.reason;
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(t) {
    if (this.reason) {
      t(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(t) : this._listeners = [t];
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(t) {
    if (!this._listeners)
      return;
    const n = this._listeners.indexOf(t);
    n !== -1 && this._listeners.splice(n, 1);
  }
  toAbortSignal() {
    const t = new AbortController(), n = (r) => {
      t.abort(r);
    };
    return this.subscribe(n), t.signal.unsubscribe = () => this.unsubscribe(n), t.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let t;
    return {
      token: new pe(function(s) {
        t = s;
      }),
      cancel: t
    };
  }
}
function kn(e) {
  return function(n) {
    return e.apply(null, n);
  };
}
function jn(e) {
  return a.isObject(e) && e.isAxiosError === !0;
}
const le = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(le).forEach(([e, t]) => {
  le[t] = e;
});
function nt(e) {
  const t = new D(e), n = Le(D.prototype.request, t);
  return a.extend(n, D.prototype, t, { allOwnKeys: !0 }), a.extend(n, t, null, { allOwnKeys: !0 }), n.create = function(s) {
    return nt(U(e, s));
  }, n;
}
const S = nt(z);
S.Axios = D;
S.CanceledError = j;
S.CancelToken = pe;
S.isCancel = We;
S.VERSION = tt;
S.toFormData = Y;
S.AxiosError = y;
S.Cancel = S.CanceledError;
S.all = function(t) {
  return Promise.all(t);
};
S.spread = kn;
S.isAxiosError = jn;
S.mergeConfig = U;
S.AxiosHeaders = _;
S.formToJSON = (e) => Ve(a.isHTMLForm(e) ? new FormData(e) : e);
S.getAdapter = et.getAdapter;
S.HttpStatusCode = le;
S.default = S;
const qn = {
  attributes: {
    "@ctype": "textUnit"
  },
  children: [{
    attributes: {
      "@ctype": "paragraph"
    },
    children: [{
      attributes: {
        "@ctype": "textNode"
      },
      type: "node",
      children: []
    }],
    type: "paragraph"
  }],
  type: "unit"
};
class zn {
  constructor(t, n, r, s, o, i) {
    P(this, "_gptKey");
    P(this, "_searchKey");
    P(this, "_searchSecret");
    P(this, "_doc");
    P(this, "_client");
    P(this, "_initialized", !1);
    this._gptKey = t, this._searchKey = o, this._searchSecret = i, this._doc = new Ne(n, {
      disableGC: !0
    }), this._client = new Fe(`https://${s}`, {
      apiKey: r
    });
  }
  /** */
  async initialize() {
    if (this._initialized)
      return Promise.resolve();
    try {
      await this._client.activate(), await this._client.attach(this._doc, {
        initialPresence: { userId: "imageSearch" }
      }), this._initialized = !0;
    } catch {
      return !1;
    }
    return Promise.resolve();
  }
  /**
   *
   */
  async generate(t, n = 0, r) {
    this._client.changeSyncMode(this._doc, M.RealtimePushOnly);
    const s = await this._fetch(t);
    if (!s.length) {
      this._client.changeSyncMode(this._doc, M.Realtime);
      return;
    }
    const { link: o } = s[0], { displayFormat: i, domain: c, fileName: d, fileSize: l, format: u, height: f, internalResource: g, originalHeight: w, originalWidth: h, path: m, width: p } = await r(o), b = {
      attributes: {
        "@ctype": "image",
        contentMode: "normal",
        imageData: {
          displayFormat: i,
          domain: c,
          fileName: d,
          fileSize: l,
          format: u,
          height: f,
          internalResource: g,
          origin: {
            "@ctype": "imageOrigin",
            srcFrom: "copyUrl"
          },
          originalHeight: w,
          originalWidth: h,
          path: m,
          src: c + m,
          width: p
        },
        layout: "default",
        linkTagData: {
          link: "",
          mediaTags: []
        },
        represent: !1
      },
      children: [qn]
    };
    this._doc.update((E) => {
      E.text.editByPath([n], [n], b);
    }), this._client.changeSyncMode(this._doc, M.Realtime);
  }
  async _fetch(t) {
    const n = [
      { role: "system", content: '지금부터 내가 입력한 자연어를 검색 엔진에 맞는 용도로 바꿔줘야해. 그리고 모든 답변은 한국어로 해줘. 내가 무엇무엇을 검색해줘 라고 하면 그것을 검색창에 검색하기 위한 쿼리를 너가 만들어줘야해. 예를 들어 "발리 해변 사진 검색해줘" 라고 하면 "발리 해변 사진" 이라는 응답을 줘' },
      {
        role: "user",
        content: t
      }
    ], o = (await (await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this._gptKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: n,
        temperature: 0.2
        // 텍스트 정제는 창의성보다는 정확성이 중요하므로 낮은 온도를 설정
      })
    })).json()).choices[0].message.content.trim();
    return console.log(o), (await S.get("https://cors-anywhere.herokuapp.com/https://openapi.naver.com/v1/search/image", {
      method: "GET",
      headers: {
        "X-Naver-Client-Id": this._searchKey,
        "X-Naver-Client-Secret": this._searchSecret
      },
      params: {
        query: o,
        sort: "sim",
        display: 1
      }
    })).data.items;
  }
}
export {
  zn as AIImageSearch,
  Hn as AIWriter
};
