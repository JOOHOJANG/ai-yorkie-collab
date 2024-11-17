var rt = Object.defineProperty;
var st = (e, t, n) => t in e ? rt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var S = (e, t, n) => st(e, typeof t != "symbol" ? t + "" : t, n);
import { Document as V, Client as G, SyncMode as N } from "yorkie-js-sdk";
const ot = 150, Fe = {
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
  children: [Fe],
  attributes: { "@ctype": "text", layout: "default" }
}, at = {
  type: "component",
  attributes: {
    "@ctype": "horizontalLine",
    layout: "line1"
  },
  children: []
};
class $n {
  constructor(t, n, r, s) {
    S(this, "_gptKey");
    S(this, "_initialized", !1);
    S(this, "_messages", [
      {
        role: "system",
        content: "모든 대답은 한국어로, 최소한 3개의 문단을 포함해야하며, 가능한 길게 대답해야해. 그리고 답변은 사람이 말하는것처럼 하지 말고, 보고서에 정리하는것처럼 해줘."
      }
    ]);
    S(this, "_doc");
    S(this, "_client");
    this._gptKey = t, this._doc = new V(n, {
      disableGC: !0
    }), this._client = new G(`https://${s}`, {
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
    const s = await this._fetch(t), { content: i } = s.choices[0].message;
    if (!i.length)
      return;
    this._client.changeSyncMode(this._doc, N.RealtimePushOnly), this._doc.update((f) => {
      f.text.editBulkByPath(
        [r],
        [r],
        [at, it]
      );
    });
    const o = i.split(`
`).flatMap((f) => {
      let y = 0;
      const w = [""];
      for (; y < f.length; )
        w.push(f.slice(y, y + 3)), y += 3;
      return w;
    });
    let c = 1, d = 0, l = 0;
    const u = () => {
      o[c] === "" ? (l++, d = 0, this._doc.update((f) => {
        f.text.editByPath(
          [r + 1, l],
          [r + 1, l],
          Fe
        );
      })) : o[c].length && this._doc.update((f, y) => {
        const w = [r + 1, l, 0, d];
        f.text.editByPath(w, w, {
          type: "text",
          value: o[c]
        });
        const h = [
          r + 1,
          l,
          0,
          d + o[c].length
        ];
        y.set({
          selections: [
            f.text.pathRangeToPosRange([h, h])
          ],
          userId: "gpt"
        }), d += o[c].length;
      }), c++, setTimeout(() => {
        if (c < o.length)
          u();
        else
          return this._client.changeSyncMode(this._doc, N.Realtime), this._doc.update((f, y) => {
            y.set({ userId: "gpt" });
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
const { toString: ct } = Object.prototype, { getPrototypeOf: de } = Object, X = /* @__PURE__ */ ((e) => (t) => {
  const n = ct.call(t);
  return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), x = (e) => (e = e.toLowerCase(), (t) => X(t) === e), Y = (e) => (t) => typeof t === e, { isArray: j } = Array, q = Y("undefined");
function lt(e) {
  return e !== null && !q(e) && e.constructor !== null && !q(e.constructor) && P(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
const De = x("ArrayBuffer");
function ut(e) {
  let t;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? t = ArrayBuffer.isView(e) : t = e && e.buffer && De(e.buffer), t;
}
const ft = Y("string"), P = Y("function"), Ue = Y("number"), Q = (e) => e !== null && typeof e == "object", dt = (e) => e === !0 || e === !1, $ = (e) => {
  if (X(e) !== "object")
    return !1;
  const t = de(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}, ht = x("Date"), pt = x("File"), mt = x("Blob"), yt = x("FileList"), gt = (e) => Q(e) && P(e.pipe), wt = (e) => {
  let t;
  return e && (typeof FormData == "function" && e instanceof FormData || P(e.append) && ((t = X(e)) === "formdata" || // detect form-data instance
  t === "object" && P(e.toString) && e.toString() === "[object FormData]"));
}, bt = x("URLSearchParams"), [Et, St, Rt, _t] = ["ReadableStream", "Request", "Response", "Headers"].map(x), Tt = (e) => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function z(e, t, { allOwnKeys: n = !1 } = {}) {
  if (e === null || typeof e > "u")
    return;
  let r, s;
  if (typeof e != "object" && (e = [e]), j(e))
    for (r = 0, s = e.length; r < s; r++)
      t.call(null, e[r], r, e);
  else {
    const i = n ? Object.getOwnPropertyNames(e) : Object.keys(e), o = i.length;
    let c;
    for (r = 0; r < o; r++)
      c = i[r], t.call(null, e[c], c, e);
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
const D = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, je = (e) => !q(e) && e !== D;
function oe() {
  const { caseless: e } = je(this) && this || {}, t = {}, n = (r, s) => {
    const i = e && ke(t, s) || s;
    $(t[i]) && $(r) ? t[i] = oe(t[i], r) : $(r) ? t[i] = oe({}, r) : j(r) ? t[i] = r.slice() : t[i] = r;
  };
  for (let r = 0, s = arguments.length; r < s; r++)
    arguments[r] && z(arguments[r], n);
  return t;
}
const Ot = (e, t, n, { allOwnKeys: r } = {}) => (z(t, (s, i) => {
  n && P(s) ? e[i] = Le(s, n) : e[i] = s;
}, { allOwnKeys: r }), e), At = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), Pt = (e, t, n, r) => {
  e.prototype = Object.create(t.prototype, r), e.prototype.constructor = e, Object.defineProperty(e, "super", {
    value: t.prototype
  }), n && Object.assign(e.prototype, n);
}, xt = (e, t, n, r) => {
  let s, i, o;
  const c = {};
  if (t = t || {}, e == null) return t;
  do {
    for (s = Object.getOwnPropertyNames(e), i = s.length; i-- > 0; )
      o = s[i], (!r || r(o, e, t)) && !c[o] && (t[o] = e[o], c[o] = !0);
    e = n !== !1 && de(e);
  } while (e && (!n || n(e, t)) && e !== Object.prototype);
  return t;
}, Nt = (e, t, n) => {
  e = String(e), (n === void 0 || n > e.length) && (n = e.length), n -= t.length;
  const r = e.indexOf(t, n);
  return r !== -1 && r === n;
}, Ct = (e) => {
  if (!e) return null;
  if (j(e)) return e;
  let t = e.length;
  if (!Ue(t)) return null;
  const n = new Array(t);
  for (; t-- > 0; )
    n[t] = e[t];
  return n;
}, Bt = /* @__PURE__ */ ((e) => (t) => e && t instanceof e)(typeof Uint8Array < "u" && de(Uint8Array)), Ft = (e, t) => {
  const r = (e && e[Symbol.iterator]).call(e);
  let s;
  for (; (s = r.next()) && !s.done; ) {
    const i = s.value;
    t.call(e, i[0], i[1]);
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
), we = (({ hasOwnProperty: e }) => (t, n) => e.call(t, n))(Object.prototype), kt = x("RegExp"), Me = (e, t) => {
  const n = Object.getOwnPropertyDescriptors(e), r = {};
  z(n, (s, i) => {
    let o;
    (o = t(s, i, e)) !== !1 && (r[i] = o || s);
  }), Object.defineProperties(e, r);
}, jt = (e) => {
  Me(e, (t, n) => {
    if (P(e) && ["arguments", "caller", "callee"].indexOf(n) !== -1)
      return !1;
    const r = e[n];
    if (P(r)) {
      if (t.enumerable = !1, "writable" in t) {
        t.writable = !1;
        return;
      }
      t.set || (t.set = () => {
        throw Error("Can not rewrite read-only method '" + n + "'");
      });
    }
  });
}, Mt = (e, t) => {
  const n = {}, r = (s) => {
    s.forEach((i) => {
      n[i] = !0;
    });
  };
  return j(e) ? r(e) : r(String(e).split(t)), n;
}, It = () => {
}, qt = (e, t) => e != null && Number.isFinite(e = +e) ? e : t, te = "abcdefghijklmnopqrstuvwxyz", be = "0123456789", Ie = {
  DIGIT: be,
  ALPHA: te,
  ALPHA_DIGIT: te + te.toUpperCase() + be
}, zt = (e = 16, t = Ie.ALPHA_DIGIT) => {
  let n = "";
  const { length: r } = t;
  for (; e--; )
    n += t[Math.random() * r | 0];
  return n;
};
function Ht(e) {
  return !!(e && P(e.append) && e[Symbol.toStringTag] === "FormData" && e[Symbol.iterator]);
}
const vt = (e) => {
  const t = new Array(10), n = (r, s) => {
    if (Q(r)) {
      if (t.indexOf(r) >= 0)
        return;
      if (!("toJSON" in r)) {
        t[s] = r;
        const i = j(r) ? [] : {};
        return z(r, (o, c) => {
          const d = n(o, s + 1);
          !q(d) && (i[c] = d);
        }), t[s] = void 0, i;
      }
    }
    return r;
  };
  return n(e, 0);
}, $t = x("AsyncFunction"), Kt = (e) => e && (Q(e) || P(e)) && P(e.then) && P(e.catch), qe = ((e, t) => e ? setImmediate : t ? ((n, r) => (D.addEventListener("message", ({ source: s, data: i }) => {
  s === D && i === n && r.length && r.shift()();
}, !1), (s) => {
  r.push(s), D.postMessage(n, "*");
}))(`axios@${Math.random()}`, []) : (n) => setTimeout(n))(
  typeof setImmediate == "function",
  P(D.postMessage)
), Jt = typeof queueMicrotask < "u" ? queueMicrotask.bind(D) : typeof process < "u" && process.nextTick || qe, a = {
  isArray: j,
  isArrayBuffer: De,
  isBuffer: lt,
  isFormData: wt,
  isArrayBufferView: ut,
  isString: ft,
  isNumber: Ue,
  isBoolean: dt,
  isObject: Q,
  isPlainObject: $,
  isReadableStream: Et,
  isRequest: St,
  isResponse: Rt,
  isHeaders: _t,
  isUndefined: q,
  isDate: ht,
  isFile: pt,
  isBlob: mt,
  isRegExp: kt,
  isFunction: P,
  isStream: gt,
  isURLSearchParams: bt,
  isTypedArray: Bt,
  isFileList: yt,
  forEach: z,
  merge: oe,
  extend: Ot,
  trim: Tt,
  stripBOM: At,
  inherits: Pt,
  toFlatObject: xt,
  kindOf: X,
  kindOfTest: x,
  endsWith: Nt,
  toArray: Ct,
  forEachEntry: Ft,
  matchAll: Lt,
  isHTMLForm: Dt,
  hasOwnProperty: we,
  hasOwnProp: we,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: Me,
  freezeMethods: jt,
  toObjectSet: Mt,
  toCamelCase: Ut,
  noop: It,
  toFiniteNumber: qt,
  findKey: ke,
  global: D,
  isContextDefined: je,
  ALPHABET: Ie,
  generateString: zt,
  isSpecCompliantForm: Ht,
  toJSONObject: vt,
  isAsyncFn: $t,
  isThenable: Kt,
  setImmediate: qe,
  asap: Jt
};
function g(e, t, n, r, s) {
  Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = e, this.name = "AxiosError", t && (this.code = t), n && (this.config = n), r && (this.request = r), s && (this.response = s, this.status = s.status ? s.status : null);
}
a.inherits(g, Error, {
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
const ze = g.prototype, He = {};
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
  He[e] = { value: e };
});
Object.defineProperties(g, He);
Object.defineProperty(ze, "isAxiosError", { value: !0 });
g.from = (e, t, n, r, s, i) => {
  const o = Object.create(ze);
  return a.toFlatObject(e, o, function(d) {
    return d !== Error.prototype;
  }, (c) => c !== "isAxiosError"), g.call(o, e.message, t, n, r, s), o.cause = e, o.name = e.name, i && Object.assign(o, i), o;
};
const Wt = null;
function ie(e) {
  return a.isPlainObject(e) || a.isArray(e);
}
function ve(e) {
  return a.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function Ee(e, t, n) {
  return e ? e.concat(t).map(function(s, i) {
    return s = ve(s), !n && i ? "[" + s + "]" : s;
  }).join(n ? "." : "") : t;
}
function Vt(e) {
  return a.isArray(e) && !e.some(ie);
}
const Gt = a.toFlatObject(a, {}, null, function(t) {
  return /^is[A-Z]/.test(t);
});
function Z(e, t, n) {
  if (!a.isObject(e))
    throw new TypeError("target must be an object");
  t = t || new FormData(), n = a.toFlatObject(n, {
    metaTokens: !0,
    dots: !1,
    indexes: !1
  }, !1, function(m, p) {
    return !a.isUndefined(p[m]);
  });
  const r = n.metaTokens, s = n.visitor || u, i = n.dots, o = n.indexes, d = (n.Blob || typeof Blob < "u" && Blob) && a.isSpecCompliantForm(t);
  if (!a.isFunction(s))
    throw new TypeError("visitor must be a function");
  function l(h) {
    if (h === null) return "";
    if (a.isDate(h))
      return h.toISOString();
    if (!d && a.isBlob(h))
      throw new g("Blob is not supported. Use a Buffer instead.");
    return a.isArrayBuffer(h) || a.isTypedArray(h) ? d && typeof Blob == "function" ? new Blob([h]) : Buffer.from(h) : h;
  }
  function u(h, m, p) {
    let b = h;
    if (h && !p && typeof h == "object") {
      if (a.endsWith(m, "{}"))
        m = r ? m : m.slice(0, -2), h = JSON.stringify(h);
      else if (a.isArray(h) && Vt(h) || (a.isFileList(h) || a.endsWith(m, "[]")) && (b = a.toArray(h)))
        return m = ve(m), b.forEach(function(_, C) {
          !(a.isUndefined(_) || _ === null) && t.append(
            // eslint-disable-next-line no-nested-ternary
            o === !0 ? Ee([m], C, i) : o === null ? m : m + "[]",
            l(_)
          );
        }), !1;
    }
    return ie(h) ? !0 : (t.append(Ee(p, m, i), l(h)), !1);
  }
  const f = [], y = Object.assign(Gt, {
    defaultVisitor: u,
    convertValue: l,
    isVisitable: ie
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
          y
        )) === !0 && w(b, m ? m.concat(E) : [E]);
      }), f.pop();
    }
  }
  if (!a.isObject(e))
    throw new TypeError("data must be an object");
  return w(e), t;
}
function Se(e) {
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
function he(e, t) {
  this._pairs = [], e && Z(e, this, t);
}
const $e = he.prototype;
$e.append = function(t, n) {
  this._pairs.push([t, n]);
};
$e.toString = function(t) {
  const n = t ? function(r) {
    return t.call(this, r, Se);
  } : Se;
  return this._pairs.map(function(s) {
    return n(s[0]) + "=" + n(s[1]);
  }, "").join("&");
};
function Xt(e) {
  return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function Ke(e, t, n) {
  if (!t)
    return e;
  const r = n && n.encode || Xt, s = n && n.serialize;
  let i;
  if (s ? i = s(t, n) : i = a.isURLSearchParams(t) ? t.toString() : new he(t, n).toString(r), i) {
    const o = e.indexOf("#");
    o !== -1 && (e = e.slice(0, o)), e += (e.indexOf("?") === -1 ? "?" : "&") + i;
  }
  return e;
}
class Re {
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
const Je = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, Yt = typeof URLSearchParams < "u" ? URLSearchParams : he, Qt = typeof FormData < "u" ? FormData : null, Zt = typeof Blob < "u" ? Blob : null, en = {
  isBrowser: !0,
  classes: {
    URLSearchParams: Yt,
    FormData: Qt,
    Blob: Zt
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
}, pe = typeof window < "u" && typeof document < "u", ae = typeof navigator == "object" && navigator || void 0, tn = pe && (!ae || ["ReactNative", "NativeScript", "NS"].indexOf(ae.product) < 0), nn = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", rn = pe && window.location.href || "http://localhost", sn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: pe,
  hasStandardBrowserEnv: tn,
  hasStandardBrowserWebWorkerEnv: nn,
  navigator: ae,
  origin: rn
}, Symbol.toStringTag, { value: "Module" })), O = {
  ...sn,
  ...en
};
function on(e, t) {
  return Z(e, new O.classes.URLSearchParams(), Object.assign({
    visitor: function(n, r, s, i) {
      return O.isNode && a.isBuffer(n) ? (this.append(r, n.toString("base64")), !1) : i.defaultVisitor.apply(this, arguments);
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
  let i;
  for (r = 0; r < s; r++)
    i = n[r], t[i] = e[i];
  return t;
}
function We(e) {
  function t(n, r, s, i) {
    let o = n[i++];
    if (o === "__proto__") return !0;
    const c = Number.isFinite(+o), d = i >= n.length;
    return o = !o && a.isArray(s) ? s.length : o, d ? (a.hasOwnProp(s, o) ? s[o] = [s[o], r] : s[o] = r, !c) : ((!s[o] || !a.isObject(s[o])) && (s[o] = []), t(n, r, s[o], i) && a.isArray(s[o]) && (s[o] = cn(s[o])), !c);
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
const H = {
  transitional: Je,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function(t, n) {
    const r = n.getContentType() || "", s = r.indexOf("application/json") > -1, i = a.isObject(t);
    if (i && a.isHTMLForm(t) && (t = new FormData(t)), a.isFormData(t))
      return s ? JSON.stringify(We(t)) : t;
    if (a.isArrayBuffer(t) || a.isBuffer(t) || a.isStream(t) || a.isFile(t) || a.isBlob(t) || a.isReadableStream(t))
      return t;
    if (a.isArrayBufferView(t))
      return t.buffer;
    if (a.isURLSearchParams(t))
      return n.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), t.toString();
    let c;
    if (i) {
      if (r.indexOf("application/x-www-form-urlencoded") > -1)
        return on(t, this.formSerializer).toString();
      if ((c = a.isFileList(t)) || r.indexOf("multipart/form-data") > -1) {
        const d = this.env && this.env.FormData;
        return Z(
          c ? { "files[]": t } : t,
          d && new d(),
          this.formSerializer
        );
      }
    }
    return i || s ? (n.setContentType("application/json", !1), ln(t)) : t;
  }],
  transformResponse: [function(t) {
    const n = this.transitional || H.transitional, r = n && n.forcedJSONParsing, s = this.responseType === "json";
    if (a.isResponse(t) || a.isReadableStream(t))
      return t;
    if (t && a.isString(t) && (r && !this.responseType || s)) {
      const o = !(n && n.silentJSONParsing) && s;
      try {
        return JSON.parse(t);
      } catch (c) {
        if (o)
          throw c.name === "SyntaxError" ? g.from(c, g.ERR_BAD_RESPONSE, this, null, this.response) : c;
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
  H.headers[e] = {};
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
`).forEach(function(o) {
    s = o.indexOf(":"), n = o.substring(0, s).trim().toLowerCase(), r = o.substring(s + 1).trim(), !(!n || t[n] && un[n]) && (n === "set-cookie" ? t[n] ? t[n].push(r) : t[n] = [r] : t[n] = t[n] ? t[n] + ", " + r : r);
  }), t;
}, _e = Symbol("internals");
function I(e) {
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
function ne(e, t, n, r, s) {
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
      value: function(s, i, o) {
        return this[r].call(this, t, s, i, o);
      },
      configurable: !0
    });
  });
}
class A {
  constructor(t) {
    t && this.set(t);
  }
  set(t, n, r) {
    const s = this;
    function i(c, d, l) {
      const u = I(d);
      if (!u)
        throw new Error("header name must be a non-empty string");
      const f = a.findKey(s, u);
      (!f || s[f] === void 0 || l === !0 || l === void 0 && s[f] !== !1) && (s[f || d] = K(c));
    }
    const o = (c, d) => a.forEach(c, (l, u) => i(l, u, d));
    if (a.isPlainObject(t) || t instanceof this.constructor)
      o(t, n);
    else if (a.isString(t) && (t = t.trim()) && !hn(t))
      o(fn(t), n);
    else if (a.isHeaders(t))
      for (const [c, d] of t.entries())
        i(d, c, r);
    else
      t != null && i(n, t, r);
    return this;
  }
  get(t, n) {
    if (t = I(t), t) {
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
    if (t = I(t), t) {
      const r = a.findKey(this, t);
      return !!(r && this[r] !== void 0 && (!n || ne(this, this[r], r, n)));
    }
    return !1;
  }
  delete(t, n) {
    const r = this;
    let s = !1;
    function i(o) {
      if (o = I(o), o) {
        const c = a.findKey(r, o);
        c && (!n || ne(r, r[c], c, n)) && (delete r[c], s = !0);
      }
    }
    return a.isArray(t) ? t.forEach(i) : i(t), s;
  }
  clear(t) {
    const n = Object.keys(this);
    let r = n.length, s = !1;
    for (; r--; ) {
      const i = n[r];
      (!t || ne(this, this[i], i, t, !0)) && (delete this[i], s = !0);
    }
    return s;
  }
  normalize(t) {
    const n = this, r = {};
    return a.forEach(this, (s, i) => {
      const o = a.findKey(r, i);
      if (o) {
        n[o] = K(s), delete n[i];
        return;
      }
      const c = t ? pn(i) : String(i).trim();
      c !== i && delete n[i], n[c] = K(s), r[c] = !0;
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
    const r = (this[_e] = this[_e] = {
      accessors: {}
    }).accessors, s = this.prototype;
    function i(o) {
      const c = I(o);
      r[c] || (mn(s, o), r[c] = !0);
    }
    return a.isArray(t) ? t.forEach(i) : i(t), this;
  }
}
A.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
a.reduceDescriptors(A.prototype, ({ value: e }, t) => {
  let n = t[0].toUpperCase() + t.slice(1);
  return {
    get: () => e,
    set(r) {
      this[n] = r;
    }
  };
});
a.freezeMethods(A);
function re(e, t) {
  const n = this || H, r = t || n, s = A.from(r.headers);
  let i = r.data;
  return a.forEach(e, function(c) {
    i = c.call(n, i, s.normalize(), t ? t.status : void 0);
  }), s.normalize(), i;
}
function Ve(e) {
  return !!(e && e.__CANCEL__);
}
function M(e, t, n) {
  g.call(this, e ?? "canceled", g.ERR_CANCELED, t, n), this.name = "CanceledError";
}
a.inherits(M, g, {
  __CANCEL__: !0
});
function Ge(e, t, n) {
  const r = n.config.validateStatus;
  !n.status || !r || r(n.status) ? e(n) : t(new g(
    "Request failed with status code " + n.status,
    [g.ERR_BAD_REQUEST, g.ERR_BAD_RESPONSE][Math.floor(n.status / 100) - 4],
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
  let s = 0, i = 0, o;
  return t = t !== void 0 ? t : 1e3, function(d) {
    const l = Date.now(), u = r[i];
    o || (o = l), n[s] = d, r[s] = l;
    let f = i, y = 0;
    for (; f !== s; )
      y += n[f++], f = f % e;
    if (s = (s + 1) % e, s === i && (i = (i + 1) % e), l - o < t)
      return;
    const w = u && l - u;
    return w ? Math.round(y * 1e3 / w) : void 0;
  };
}
function wn(e, t) {
  let n = 0, r = 1e3 / t, s, i;
  const o = (l, u = Date.now()) => {
    n = u, s = null, i && (clearTimeout(i), i = null), e.apply(null, l);
  };
  return [(...l) => {
    const u = Date.now(), f = u - n;
    f >= r ? o(l, u) : (s = l, i || (i = setTimeout(() => {
      i = null, o(s);
    }, r - f)));
  }, () => s && o(s)];
}
const J = (e, t, n = 3) => {
  let r = 0;
  const s = gn(50, 250);
  return wn((i) => {
    const o = i.loaded, c = i.lengthComputable ? i.total : void 0, d = o - r, l = s(d), u = o <= c;
    r = o;
    const f = {
      loaded: o,
      total: c,
      progress: c ? o / c : void 0,
      bytes: d,
      rate: l || void 0,
      estimated: l && c && u ? (c - o) / l : void 0,
      event: i,
      lengthComputable: c != null,
      [t ? "download" : "upload"]: !0
    };
    e(f);
  }, n);
}, Te = (e, t) => {
  const n = e != null;
  return [(r) => t[0]({
    lengthComputable: n,
    total: e,
    loaded: r
  }), t[1]];
}, Oe = (e) => (...t) => a.asap(() => e(...t)), bn = O.hasStandardBrowserEnv ? (
  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  function() {
    const t = O.navigator && /(msie|trident)/i.test(O.navigator.userAgent), n = document.createElement("a");
    let r;
    function s(i) {
      let o = i;
      return t && (n.setAttribute("href", o), o = n.href), n.setAttribute("href", o), {
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
    return r = s(window.location.href), function(o) {
      const c = a.isString(o) ? s(o) : o;
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
    write(e, t, n, r, s, i) {
      const o = [e + "=" + encodeURIComponent(t)];
      a.isNumber(n) && o.push("expires=" + new Date(n).toGMTString()), a.isString(r) && o.push("path=" + r), a.isString(s) && o.push("domain=" + s), i === !0 && o.push("secure"), document.cookie = o.join("; ");
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
function Xe(e, t) {
  return e && !Sn(t) ? Rn(e, t) : t;
}
const Ae = (e) => e instanceof A ? { ...e } : e;
function k(e, t) {
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
  function i(l, u) {
    if (!a.isUndefined(u))
      return r(void 0, u);
  }
  function o(l, u) {
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
    url: i,
    method: i,
    data: i,
    baseURL: o,
    transformRequest: o,
    transformResponse: o,
    paramsSerializer: o,
    timeout: o,
    timeoutMessage: o,
    withCredentials: o,
    withXSRFToken: o,
    adapter: o,
    responseType: o,
    xsrfCookieName: o,
    xsrfHeaderName: o,
    onUploadProgress: o,
    onDownloadProgress: o,
    decompress: o,
    maxContentLength: o,
    maxBodyLength: o,
    beforeRedirect: o,
    transport: o,
    httpAgent: o,
    httpsAgent: o,
    cancelToken: o,
    socketPath: o,
    responseEncoding: o,
    validateStatus: c,
    headers: (l, u) => s(Ae(l), Ae(u), !0)
  };
  return a.forEach(Object.keys(Object.assign({}, e, t)), function(u) {
    const f = d[u] || s, y = f(e[u], t[u], u);
    a.isUndefined(y) && f !== c || (n[u] = y);
  }), n;
}
const Ye = (e) => {
  const t = k({}, e);
  let { data: n, withXSRFToken: r, xsrfHeaderName: s, xsrfCookieName: i, headers: o, auth: c } = t;
  t.headers = o = A.from(o), t.url = Ke(Xe(t.baseURL, t.url), e.params, e.paramsSerializer), c && o.set(
    "Authorization",
    "Basic " + btoa((c.username || "") + ":" + (c.password ? unescape(encodeURIComponent(c.password)) : ""))
  );
  let d;
  if (a.isFormData(n)) {
    if (O.hasStandardBrowserEnv || O.hasStandardBrowserWebWorkerEnv)
      o.setContentType(void 0);
    else if ((d = o.getContentType()) !== !1) {
      const [l, ...u] = d ? d.split(";").map((f) => f.trim()).filter(Boolean) : [];
      o.setContentType([l || "multipart/form-data", ...u].join("; "));
    }
  }
  if (O.hasStandardBrowserEnv && (r && a.isFunction(r) && (r = r(t)), r || r !== !1 && bn(t.url))) {
    const l = s && i && En.read(i);
    l && o.set(s, l);
  }
  return t;
}, _n = typeof XMLHttpRequest < "u", Tn = _n && function(e) {
  return new Promise(function(n, r) {
    const s = Ye(e);
    let i = s.data;
    const o = A.from(s.headers).normalize();
    let { responseType: c, onUploadProgress: d, onDownloadProgress: l } = s, u, f, y, w, h;
    function m() {
      w && w(), h && h(), s.cancelToken && s.cancelToken.unsubscribe(u), s.signal && s.signal.removeEventListener("abort", u);
    }
    let p = new XMLHttpRequest();
    p.open(s.method.toUpperCase(), s.url, !0), p.timeout = s.timeout;
    function b() {
      if (!p)
        return;
      const _ = A.from(
        "getAllResponseHeaders" in p && p.getAllResponseHeaders()
      ), T = {
        data: !c || c === "text" || c === "json" ? p.responseText : p.response,
        status: p.status,
        statusText: p.statusText,
        headers: _,
        config: e,
        request: p
      };
      Ge(function(L) {
        n(L), m();
      }, function(L) {
        r(L), m();
      }, T), p = null;
    }
    "onloadend" in p ? p.onloadend = b : p.onreadystatechange = function() {
      !p || p.readyState !== 4 || p.status === 0 && !(p.responseURL && p.responseURL.indexOf("file:") === 0) || setTimeout(b);
    }, p.onabort = function() {
      p && (r(new g("Request aborted", g.ECONNABORTED, e, p)), p = null);
    }, p.onerror = function() {
      r(new g("Network Error", g.ERR_NETWORK, e, p)), p = null;
    }, p.ontimeout = function() {
      let C = s.timeout ? "timeout of " + s.timeout + "ms exceeded" : "timeout exceeded";
      const T = s.transitional || Je;
      s.timeoutErrorMessage && (C = s.timeoutErrorMessage), r(new g(
        C,
        T.clarifyTimeoutError ? g.ETIMEDOUT : g.ECONNABORTED,
        e,
        p
      )), p = null;
    }, i === void 0 && o.setContentType(null), "setRequestHeader" in p && a.forEach(o.toJSON(), function(C, T) {
      p.setRequestHeader(T, C);
    }), a.isUndefined(s.withCredentials) || (p.withCredentials = !!s.withCredentials), c && c !== "json" && (p.responseType = s.responseType), l && ([y, h] = J(l, !0), p.addEventListener("progress", y)), d && p.upload && ([f, w] = J(d), p.upload.addEventListener("progress", f), p.upload.addEventListener("loadend", w)), (s.cancelToken || s.signal) && (u = (_) => {
      p && (r(!_ || _.type ? new M(null, e, p) : _), p.abort(), p = null);
    }, s.cancelToken && s.cancelToken.subscribe(u), s.signal && (s.signal.aborted ? u() : s.signal.addEventListener("abort", u)));
    const E = yn(s.url);
    if (E && O.protocols.indexOf(E) === -1) {
      r(new g("Unsupported protocol " + E + ":", g.ERR_BAD_REQUEST, e));
      return;
    }
    p.send(i || null);
  });
}, On = (e, t) => {
  const { length: n } = e = e ? e.filter(Boolean) : [];
  if (t || n) {
    let r = new AbortController(), s;
    const i = function(l) {
      if (!s) {
        s = !0, c();
        const u = l instanceof Error ? l : this.reason;
        r.abort(u instanceof g ? u : new M(u instanceof Error ? u.message : u));
      }
    };
    let o = t && setTimeout(() => {
      o = null, i(new g(`timeout ${t} of ms exceeded`, g.ETIMEDOUT));
    }, t);
    const c = () => {
      e && (o && clearTimeout(o), o = null, e.forEach((l) => {
        l.unsubscribe ? l.unsubscribe(i) : l.removeEventListener("abort", i);
      }), e = null);
    };
    e.forEach((l) => l.addEventListener("abort", i));
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
}, Pe = (e, t, n, r) => {
  const s = Pn(e, t);
  let i = 0, o, c = (d) => {
    o || (o = !0, r && r(d));
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
          let y = i += f;
          n(y);
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
}, ee = typeof fetch == "function" && typeof Request == "function" && typeof Response == "function", Qe = ee && typeof ReadableStream == "function", Nn = ee && (typeof TextEncoder == "function" ? /* @__PURE__ */ ((e) => (t) => e.encode(t))(new TextEncoder()) : async (e) => new Uint8Array(await new Response(e).arrayBuffer())), Ze = (e, ...t) => {
  try {
    return !!e(...t);
  } catch {
    return !1;
  }
}, Cn = Qe && Ze(() => {
  let e = !1;
  const t = new Request(O.origin, {
    body: new ReadableStream(),
    method: "POST",
    get duplex() {
      return e = !0, "half";
    }
  }).headers.has("Content-Type");
  return e && !t;
}), xe = 64 * 1024, ce = Qe && Ze(() => a.isReadableStream(new Response("").body)), W = {
  stream: ce && ((e) => e.body)
};
ee && ((e) => {
  ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((t) => {
    !W[t] && (W[t] = a.isFunction(e[t]) ? (n) => n[t]() : (n, r) => {
      throw new g(`Response type '${t}' is not supported`, g.ERR_NOT_SUPPORT, r);
    });
  });
})(new Response());
const Bn = async (e) => {
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
    return (await Nn(e)).byteLength;
}, Fn = async (e, t) => {
  const n = a.toFiniteNumber(e.getContentLength());
  return n ?? Bn(t);
}, Ln = ee && (async (e) => {
  let {
    url: t,
    method: n,
    data: r,
    signal: s,
    cancelToken: i,
    timeout: o,
    onDownloadProgress: c,
    onUploadProgress: d,
    responseType: l,
    headers: u,
    withCredentials: f = "same-origin",
    fetchOptions: y
  } = Ye(e);
  l = l ? (l + "").toLowerCase() : "text";
  let w = On([s, i && i.toAbortSignal()], o), h;
  const m = w && w.unsubscribe && (() => {
    w.unsubscribe();
  });
  let p;
  try {
    if (d && Cn && n !== "get" && n !== "head" && (p = await Fn(u, r)) !== 0) {
      let T = new Request(t, {
        method: "POST",
        body: r,
        duplex: "half"
      }), B;
      if (a.isFormData(r) && (B = T.headers.get("content-type")) && u.setContentType(B), T.body) {
        const [L, v] = Te(
          p,
          J(Oe(d))
        );
        r = Pe(T.body, xe, L, v);
      }
    }
    a.isString(f) || (f = f ? "include" : "omit");
    const b = "credentials" in Request.prototype;
    h = new Request(t, {
      ...y,
      signal: w,
      method: n.toUpperCase(),
      headers: u.normalize().toJSON(),
      body: r,
      duplex: "half",
      credentials: b ? f : void 0
    });
    let E = await fetch(h);
    const _ = ce && (l === "stream" || l === "response");
    if (ce && (c || _ && m)) {
      const T = {};
      ["status", "statusText", "headers"].forEach((ge) => {
        T[ge] = E[ge];
      });
      const B = a.toFiniteNumber(E.headers.get("content-length")), [L, v] = c && Te(
        B,
        J(Oe(c), !0)
      ) || [];
      E = new Response(
        Pe(E.body, xe, L, () => {
          v && v(), m && m();
        }),
        T
      );
    }
    l = l || "text";
    let C = await W[a.findKey(W, l) || "text"](E, e);
    return !_ && m && m(), await new Promise((T, B) => {
      Ge(T, B, {
        data: C,
        headers: A.from(E.headers),
        status: E.status,
        statusText: E.statusText,
        config: e,
        request: h
      });
    });
  } catch (b) {
    throw m && m(), b && b.name === "TypeError" && /fetch/i.test(b.message) ? Object.assign(
      new g("Network Error", g.ERR_NETWORK, e, h),
      {
        cause: b.cause || b
      }
    ) : g.from(b, b && b.code, e, h);
  }
}), le = {
  http: Wt,
  xhr: Tn,
  fetch: Ln
};
a.forEach(le, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, "name", { value: t });
    } catch {
    }
    Object.defineProperty(e, "adapterName", { value: t });
  }
});
const Ne = (e) => `- ${e}`, Dn = (e) => a.isFunction(e) || e === null || e === !1, et = {
  getAdapter: (e) => {
    e = a.isArray(e) ? e : [e];
    const { length: t } = e;
    let n, r;
    const s = {};
    for (let i = 0; i < t; i++) {
      n = e[i];
      let o;
      if (r = n, !Dn(n) && (r = le[(o = String(n)).toLowerCase()], r === void 0))
        throw new g(`Unknown adapter '${o}'`);
      if (r)
        break;
      s[o || "#" + i] = r;
    }
    if (!r) {
      const i = Object.entries(s).map(
        ([c, d]) => `adapter ${c} ` + (d === !1 ? "is not supported by the environment" : "is not available in the build")
      );
      let o = t ? i.length > 1 ? `since :
` + i.map(Ne).join(`
`) : " " + Ne(i[0]) : "as no adapter specified";
      throw new g(
        "There is no suitable adapter to dispatch the request " + o,
        "ERR_NOT_SUPPORT"
      );
    }
    return r;
  },
  adapters: le
};
function se(e) {
  if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)
    throw new M(null, e);
}
function Ce(e) {
  return se(e), e.headers = A.from(e.headers), e.data = re.call(
    e,
    e.transformRequest
  ), ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), et.getAdapter(e.adapter || H.adapter)(e).then(function(r) {
    return se(e), r.data = re.call(
      e,
      e.transformResponse,
      r
    ), r.headers = A.from(r.headers), r;
  }, function(r) {
    return Ve(r) || (se(e), r && r.response && (r.response.data = re.call(
      e,
      e.transformResponse,
      r.response
    ), r.response.headers = A.from(r.response.headers))), Promise.reject(r);
  });
}
const tt = "1.7.7", me = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((e, t) => {
  me[e] = function(r) {
    return typeof r === e || "a" + (t < 1 ? "n " : " ") + e;
  };
});
const Be = {};
me.transitional = function(t, n, r) {
  function s(i, o) {
    return "[Axios v" + tt + "] Transitional option '" + i + "'" + o + (r ? ". " + r : "");
  }
  return (i, o, c) => {
    if (t === !1)
      throw new g(
        s(o, " has been removed" + (n ? " in " + n : "")),
        g.ERR_DEPRECATED
      );
    return n && !Be[o] && (Be[o] = !0, console.warn(
      s(
        o,
        " has been deprecated since v" + n + " and will be removed in the near future"
      )
    )), t ? t(i, o, c) : !0;
  };
};
function Un(e, t, n) {
  if (typeof e != "object")
    throw new g("options must be an object", g.ERR_BAD_OPTION_VALUE);
  const r = Object.keys(e);
  let s = r.length;
  for (; s-- > 0; ) {
    const i = r[s], o = t[i];
    if (o) {
      const c = e[i], d = c === void 0 || o(c, i, e);
      if (d !== !0)
        throw new g("option " + i + " must be " + d, g.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (n !== !0)
      throw new g("Unknown option " + i, g.ERR_BAD_OPTION);
  }
}
const ue = {
  assertOptions: Un,
  validators: me
}, F = ue.validators;
class U {
  constructor(t) {
    this.defaults = t, this.interceptors = {
      request: new Re(),
      response: new Re()
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
        const i = s.stack ? s.stack.replace(/^.+\n/, "") : "";
        try {
          r.stack ? i && !String(r.stack).endsWith(i.replace(/^.+\n.+\n/, "")) && (r.stack += `
` + i) : r.stack = i;
        } catch {
        }
      }
      throw r;
    }
  }
  _request(t, n) {
    typeof t == "string" ? (n = n || {}, n.url = t) : n = t || {}, n = k(this.defaults, n);
    const { transitional: r, paramsSerializer: s, headers: i } = n;
    r !== void 0 && ue.assertOptions(r, {
      silentJSONParsing: F.transitional(F.boolean),
      forcedJSONParsing: F.transitional(F.boolean),
      clarifyTimeoutError: F.transitional(F.boolean)
    }, !1), s != null && (a.isFunction(s) ? n.paramsSerializer = {
      serialize: s
    } : ue.assertOptions(s, {
      encode: F.function,
      serialize: F.function
    }, !0)), n.method = (n.method || this.defaults.method || "get").toLowerCase();
    let o = i && a.merge(
      i.common,
      i[n.method]
    );
    i && a.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (h) => {
        delete i[h];
      }
    ), n.headers = A.concat(o, i);
    const c = [];
    let d = !0;
    this.interceptors.request.forEach(function(m) {
      typeof m.runWhen == "function" && m.runWhen(n) === !1 || (d = d && m.synchronous, c.unshift(m.fulfilled, m.rejected));
    });
    const l = [];
    this.interceptors.response.forEach(function(m) {
      l.push(m.fulfilled, m.rejected);
    });
    let u, f = 0, y;
    if (!d) {
      const h = [Ce.bind(this), void 0];
      for (h.unshift.apply(h, c), h.push.apply(h, l), y = h.length, u = Promise.resolve(n); f < y; )
        u = u.then(h[f++], h[f++]);
      return u;
    }
    y = c.length;
    let w = n;
    for (f = 0; f < y; ) {
      const h = c[f++], m = c[f++];
      try {
        w = h(w);
      } catch (p) {
        m.call(this, p);
        break;
      }
    }
    try {
      u = Ce.call(this, w);
    } catch (h) {
      return Promise.reject(h);
    }
    for (f = 0, y = l.length; f < y; )
      u = u.then(l[f++], l[f++]);
    return u;
  }
  getUri(t) {
    t = k(this.defaults, t);
    const n = Xe(t.baseURL, t.url);
    return Ke(n, t.params, t.paramsSerializer);
  }
}
a.forEach(["delete", "get", "head", "options"], function(t) {
  U.prototype[t] = function(n, r) {
    return this.request(k(r || {}, {
      method: t,
      url: n,
      data: (r || {}).data
    }));
  };
});
a.forEach(["post", "put", "patch"], function(t) {
  function n(r) {
    return function(i, o, c) {
      return this.request(k(c || {}, {
        method: t,
        headers: r ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: i,
        data: o
      }));
    };
  }
  U.prototype[t] = n(), U.prototype[t + "Form"] = n(!0);
});
class ye {
  constructor(t) {
    if (typeof t != "function")
      throw new TypeError("executor must be a function.");
    let n;
    this.promise = new Promise(function(i) {
      n = i;
    });
    const r = this;
    this.promise.then((s) => {
      if (!r._listeners) return;
      let i = r._listeners.length;
      for (; i-- > 0; )
        r._listeners[i](s);
      r._listeners = null;
    }), this.promise.then = (s) => {
      let i;
      const o = new Promise((c) => {
        r.subscribe(c), i = c;
      }).then(s);
      return o.cancel = function() {
        r.unsubscribe(i);
      }, o;
    }, t(function(i, o, c) {
      r.reason || (r.reason = new M(i, o, c), n(r.reason));
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
      token: new ye(function(s) {
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
const fe = {
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
Object.entries(fe).forEach(([e, t]) => {
  fe[t] = e;
});
function nt(e) {
  const t = new U(e), n = Le(U.prototype.request, t);
  return a.extend(n, U.prototype, t, { allOwnKeys: !0 }), a.extend(n, t, null, { allOwnKeys: !0 }), n.create = function(s) {
    return nt(k(e, s));
  }, n;
}
const R = nt(H);
R.Axios = U;
R.CanceledError = M;
R.CancelToken = ye;
R.isCancel = Ve;
R.VERSION = tt;
R.toFormData = Z;
R.AxiosError = g;
R.Cancel = R.CanceledError;
R.all = function(t) {
  return Promise.all(t);
};
R.spread = kn;
R.isAxiosError = jn;
R.mergeConfig = k;
R.AxiosHeaders = A;
R.formToJSON = (e) => We(a.isHTMLForm(e) ? new FormData(e) : e);
R.getAdapter = et.getAdapter;
R.HttpStatusCode = fe;
R.default = R;
const Mn = {
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
class Kn {
  constructor(t, n, r, s, i, o) {
    S(this, "_gptKey");
    S(this, "_searchKey");
    S(this, "_searchSecret");
    S(this, "_doc");
    S(this, "_client");
    S(this, "_initialized", !1);
    this._gptKey = t, this._searchKey = i, this._searchSecret = o, this._doc = new V(n, {
      disableGC: !0
    }), this._client = new G(`https://${s}`, {
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
    this._client.changeSyncMode(this._doc, N.RealtimePushOnly);
    const s = await this._fetch(t);
    if (!s.length) {
      this._client.changeSyncMode(this._doc, N.Realtime);
      return;
    }
    const { link: i } = s[0], { displayFormat: o, domain: c, fileName: d, fileSize: l, format: u, height: f, internalResource: y, originalHeight: w, originalWidth: h, path: m, width: p } = await r(i), b = {
      attributes: {
        "@ctype": "image",
        contentMode: "normal",
        imageData: {
          displayFormat: o,
          domain: c,
          fileName: d,
          fileSize: l,
          format: u,
          height: f,
          internalResource: y,
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
      children: [Mn]
    };
    this._doc.update((E) => {
      E.text.editByPath([n], [n], b);
    }), this._client.changeSyncMode(this._doc, N.Realtime);
  }
  async _fetch(t) {
    const n = [
      { role: "system", content: '지금부터 내가 입력한 자연어를 검색 엔진에 맞는 용도로 바꿔줘야해. 그리고 모든 답변은 한국어로 해줘. 내가 무엇무엇을 검색해줘 라고 하면 그것을 검색창에 검색하기 위한 쿼리를 너가 만들어줘야해. 예를 들어 "발리 해변 사진 검색해줘" 라고 하면 "발리 해변 사진" 이라는 응답을 줘' },
      {
        role: "user",
        content: t
      }
    ], i = (await (await fetch("https://api.openai.com/v1/chat/completions", {
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
    return console.log(i), (await R.get("https://cors-anywhere.herokuapp.com/https://openapi.naver.com/v1/search/image", {
      method: "GET",
      headers: {
        "X-Naver-Client-Id": this._searchKey,
        "X-Naver-Client-Secret": this._searchSecret
      },
      params: {
        query: i,
        sort: "sim",
        display: 1
      }
    })).data.items;
  }
}
const In = {
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
class Jn {
  constructor(t, n, r, s) {
    S(this, "_gptKey");
    S(this, "_doc");
    S(this, "_client");
    S(this, "_initialized", !1);
    this._gptKey = t, this._doc = new V(n, {
      disableGC: !0
    }), this._client = new G(`https://${s}`, {
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
    this._client.changeSyncMode(this._doc, N.RealtimePushOnly);
    const s = await this._fetch(t);
    if (!s.length) {
      this._client.changeSyncMode(this._doc, N.Realtime);
      return;
    }
    const { displayFormat: i, domain: o, fileName: c, fileSize: d, format: l, height: u, internalResource: f, originalHeight: y, originalWidth: w, path: h, width: m } = await r(s), p = {
      attributes: {
        "@ctype": "image",
        contentMode: "normal",
        imageData: {
          displayFormat: i,
          domain: o,
          fileName: c,
          fileSize: d,
          format: l,
          height: u,
          internalResource: f,
          origin: {
            "@ctype": "imageOrigin",
            srcFrom: "copyUrl"
          },
          originalHeight: y,
          originalWidth: w,
          path: h,
          src: o + h,
          width: m
        },
        layout: "default",
        linkTagData: {
          link: "",
          mediaTags: []
        },
        represent: !1
      },
      children: [In]
    };
    this._doc.update((b) => {
      b.text.editByPath([n], [n], p);
    }), this._client.changeSyncMode(this._doc, N.Realtime);
  }
  async _fetch(t) {
    const n = [
      { role: "system", content: "지금부터 내가 입력하는 텍스트에서 키워드를 뽑아서 dall e 에서 사진 생성이 가능하도록 키워드를 뽑아줘" },
      {
        role: "user",
        content: t
      }
    ], s = await (await fetch("https://api.openai.com/v1/chat/completions", {
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
    })).json(), { content: i } = s.choices[0].message;
    console.log(s);
    const o = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this._gptKey}`
      },
      body: JSON.stringify({
        prompt: i,
        n: 1,
        // 이미지 개수
        size: "1024x1024"
        // 이미지 크기
      })
    });
    if (!o.ok)
      throw new Error(`Error: ${o.statusText}`);
    const c = await o.json(), d = c.data[0].url;
    return console.log(c), d;
  }
}
const qn = 150, zn = {
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
};
class Wn {
  constructor(t, n, r, s) {
    S(this, "_gptKey");
    S(this, "_initialized", !1);
    S(this, "_messages", [
      {
        role: "system",
        content: "지금부터 내가 입력하는 문장을 영어로 번역해줘. 너의 대답은 번역된 텍스트만 포함하고 있어야해. 다른 말은 추가하면 안돼. 그리고 너의 답변에 개행문자가 들어가면 안돼. 하나의 문장으로 답변해."
      }
    ]);
    S(this, "_doc");
    S(this, "_client");
    this._gptKey = t, this._doc = new V(n, {
      disableGC: !0
    }), this._client = new G(`https://${s}`, {
      apiKey: r
    });
  }
  /** */
  async initialize() {
    if (this._initialized)
      return Promise.resolve();
    try {
      await this._client.activate(), await this._client.attach(this._doc, {
        initialPresence: { userId: "translator" }
      }), this._initialized = !0;
    } catch {
      return !1;
    }
    return Promise.resolve();
  }
  /**
   *
   */
  async generate(t, n) {
    const r = await this._fetch(t), { content: s } = r.choices[0].message;
    if (!s.length)
      return;
    this._client.changeSyncMode(this._doc, N.RealtimePushOnly);
    const i = s.split(`
`).flatMap((f) => {
      let y = 0;
      const w = [""];
      for (; y < f.length; )
        w.push(f.slice(y, y + 3)), y += 3;
      return w;
    });
    let o = 0, c = 0;
    const d = n[0];
    let l = n[1];
    const u = () => {
      i[o] === "" ? this._doc.update((f) => {
        f.text.editByPath(
          [d, l],
          [d, l],
          zn
        );
      }) : i[o].length && this._doc.update((f, y) => {
        const w = [d, l, 0, c];
        f.text.editByPath(w, w, {
          type: "text",
          value: i[o]
        });
        const h = [
          d,
          l,
          0,
          c + i[o].length
        ];
        y.set({
          selections: [
            f.text.pathRangeToPosRange([h, h])
          ],
          userId: "translator"
        }), c += i[o].length;
      }), o++, setTimeout(() => {
        if (o < i.length)
          u();
        else
          return this._client.changeSyncMode(this._doc, N.Realtime), this._doc.update((f, y) => {
            y.set({
              userId: "gpt",
              selections: [
                f.text.pathRangeToPosRange([[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]])
              ]
            });
          }), Promise.resolve();
      }, qn);
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
export {
  Jn as AIImageGenerator,
  Kn as AIImageSearch,
  Wn as AITranslator,
  $n as AIWriter
};
