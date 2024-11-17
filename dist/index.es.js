var st = Object.defineProperty;
var rt = (e, t, n) => t in e ? st(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var b = (e, t, n) => rt(e, typeof t != "symbol" ? t + "" : t, n);
import { Document as q, Client as v, SyncMode as O } from "yorkie-js-sdk";
const it = 150, Fe = {
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
}, ot = {
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
  constructor(t, n, s, r) {
    b(this, "_gptKey");
    b(this, "_initialized", !1);
    b(this, "_messages", [
      {
        role: "system",
        content: "모든 대답은 한국어로, 최소한 3개의 문단을 포함해야하며, 가능한 길게 대답해야해. 그리고 답변은 사람이 말하는것처럼 하지 말고, 보고서에 정리하는것처럼 해줘."
      }
    ]);
    b(this, "_doc");
    b(this, "_client");
    this._gptKey = t, this._doc = new q(n, {
      disableGC: !0
    }), this._client = new v(`https://${r}`, {
      apiKey: s
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
  async generate(t, n = "", s = 0) {
    this._client.changeSyncMode(this._doc, O.RealtimePushOnly), n.length && this._messages.push({
      role: "system",
      content: `이제부터 내가 하는 모든 질문은 지금 내가 준 컨텍스트를 베이스에 두고 대답해줘야해. 다음줄부터 컨텍스트를 알려줄게. 
 ${n}`
    });
    const r = await this._fetch(t), { content: o } = r.choices[0].message;
    if (!o.length) {
      this._client.changeSyncMode(this._doc, O.Realtime);
      return;
    }
    this._doc.update((f) => {
      f.text.editBulkByPath(
        [s],
        [s],
        [at, ot]
      );
    });
    const i = o.split(`
`).flatMap((f) => {
      let y = 0;
      const w = [""];
      for (; y < f.length; )
        w.push(f.slice(y, y + 3)), y += 3;
      return w;
    });
    let c = 1, d = 0, l = 0;
    const u = () => {
      i[c] === "" ? (l++, d = 0, this._doc.update((f) => {
        f.text.editByPath(
          [s + 1, l],
          [s + 1, l],
          Fe
        );
      })) : i[c].length && this._doc.update((f, y) => {
        const w = [s + 1, l, 0, d];
        f.text.editByPath(w, w, {
          type: "text",
          value: i[c]
        });
        const h = [
          s + 1,
          l,
          0,
          d + i[c].length
        ];
        y.set({
          selections: [
            f.text.pathRangeToPosRange([h, h])
          ],
          userId: "gpt"
        }), d += i[c].length;
      }), c++, setTimeout(() => {
        if (c < i.length)
          u();
        else
          return this._client.changeSyncMode(this._doc, O.Realtime), this._doc.update((f, y) => {
            y.set({ userId: "gpt" });
          }), Promise.resolve();
      }, it);
    };
    u();
  }
  async _fetch(t) {
    this._messages.push({ role: "user", content: t });
    const s = await (await fetch("https://api.openai.com/v1/chat/completions", {
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
      content: s.choices[0].message.content
    }), s;
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
})(/* @__PURE__ */ Object.create(null)), C = (e) => (e = e.toLowerCase(), (t) => X(t) === e), Y = (e) => (t) => typeof t === e, { isArray: j } = Array, z = Y("undefined");
function lt(e) {
  return e !== null && !z(e) && e.constructor !== null && !z(e.constructor) && x(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
const De = C("ArrayBuffer");
function ut(e) {
  let t;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? t = ArrayBuffer.isView(e) : t = e && e.buffer && De(e.buffer), t;
}
const ft = Y("string"), x = Y("function"), Ue = Y("number"), Q = (e) => e !== null && typeof e == "object", dt = (e) => e === !0 || e === !1, J = (e) => {
  if (X(e) !== "object")
    return !1;
  const t = de(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}, ht = C("Date"), pt = C("File"), mt = C("Blob"), yt = C("FileList"), gt = (e) => Q(e) && x(e.pipe), wt = (e) => {
  let t;
  return e && (typeof FormData == "function" && e instanceof FormData || x(e.append) && ((t = X(e)) === "formdata" || // detect form-data instance
  t === "object" && x(e.toString) && e.toString() === "[object FormData]"));
}, bt = C("URLSearchParams"), [_t, St, Rt, Et] = ["ReadableStream", "Request", "Response", "Headers"].map(C), Tt = (e) => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function H(e, t, { allOwnKeys: n = !1 } = {}) {
  if (e === null || typeof e > "u")
    return;
  let s, r;
  if (typeof e != "object" && (e = [e]), j(e))
    for (s = 0, r = e.length; s < r; s++)
      t.call(null, e[s], s, e);
  else {
    const o = n ? Object.getOwnPropertyNames(e) : Object.keys(e), i = o.length;
    let c;
    for (s = 0; s < i; s++)
      c = o[s], t.call(null, e[c], c, e);
  }
}
function ke(e, t) {
  t = t.toLowerCase();
  const n = Object.keys(e);
  let s = n.length, r;
  for (; s-- > 0; )
    if (r = n[s], t === r.toLowerCase())
      return r;
  return null;
}
const D = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, je = (e) => !z(e) && e !== D;
function ie() {
  const { caseless: e } = je(this) && this || {}, t = {}, n = (s, r) => {
    const o = e && ke(t, r) || r;
    J(t[o]) && J(s) ? t[o] = ie(t[o], s) : J(s) ? t[o] = ie({}, s) : j(s) ? t[o] = s.slice() : t[o] = s;
  };
  for (let s = 0, r = arguments.length; s < r; s++)
    arguments[s] && H(arguments[s], n);
  return t;
}
const Ot = (e, t, n, { allOwnKeys: s } = {}) => (H(t, (r, o) => {
  n && x(r) ? e[o] = Le(r, n) : e[o] = r;
}, { allOwnKeys: s }), e), At = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), Pt = (e, t, n, s) => {
  e.prototype = Object.create(t.prototype, s), e.prototype.constructor = e, Object.defineProperty(e, "super", {
    value: t.prototype
  }), n && Object.assign(e.prototype, n);
}, xt = (e, t, n, s) => {
  let r, o, i;
  const c = {};
  if (t = t || {}, e == null) return t;
  do {
    for (r = Object.getOwnPropertyNames(e), o = r.length; o-- > 0; )
      i = r[o], (!s || s(i, e, t)) && !c[i] && (t[i] = e[i], c[i] = !0);
    e = n !== !1 && de(e);
  } while (e && (!n || n(e, t)) && e !== Object.prototype);
  return t;
}, Ct = (e, t, n) => {
  e = String(e), (n === void 0 || n > e.length) && (n = e.length), n -= t.length;
  const s = e.indexOf(t, n);
  return s !== -1 && s === n;
}, Nt = (e) => {
  if (!e) return null;
  if (j(e)) return e;
  let t = e.length;
  if (!Ue(t)) return null;
  const n = new Array(t);
  for (; t-- > 0; )
    n[t] = e[t];
  return n;
}, Bt = /* @__PURE__ */ ((e) => (t) => e && t instanceof e)(typeof Uint8Array < "u" && de(Uint8Array)), Ft = (e, t) => {
  const s = (e && e[Symbol.iterator]).call(e);
  let r;
  for (; (r = s.next()) && !r.done; ) {
    const o = r.value;
    t.call(e, o[0], o[1]);
  }
}, Lt = (e, t) => {
  let n;
  const s = [];
  for (; (n = e.exec(t)) !== null; )
    s.push(n);
  return s;
}, Dt = C("HTMLFormElement"), Ut = (e) => e.toLowerCase().replace(
  /[-_\s]([a-z\d])(\w*)/g,
  function(n, s, r) {
    return s.toUpperCase() + r;
  }
), we = (({ hasOwnProperty: e }) => (t, n) => e.call(t, n))(Object.prototype), kt = C("RegExp"), Me = (e, t) => {
  const n = Object.getOwnPropertyDescriptors(e), s = {};
  H(n, (r, o) => {
    let i;
    (i = t(r, o, e)) !== !1 && (s[o] = i || r);
  }), Object.defineProperties(e, s);
}, jt = (e) => {
  Me(e, (t, n) => {
    if (x(e) && ["arguments", "caller", "callee"].indexOf(n) !== -1)
      return !1;
    const s = e[n];
    if (x(s)) {
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
  const n = {}, s = (r) => {
    r.forEach((o) => {
      n[o] = !0;
    });
  };
  return j(e) ? s(e) : s(String(e).split(t)), n;
}, It = () => {
}, zt = (e, t) => e != null && Number.isFinite(e = +e) ? e : t, te = "abcdefghijklmnopqrstuvwxyz", be = "0123456789", Ie = {
  DIGIT: be,
  ALPHA: te,
  ALPHA_DIGIT: te + te.toUpperCase() + be
}, qt = (e = 16, t = Ie.ALPHA_DIGIT) => {
  let n = "";
  const { length: s } = t;
  for (; e--; )
    n += t[Math.random() * s | 0];
  return n;
};
function vt(e) {
  return !!(e && x(e.append) && e[Symbol.toStringTag] === "FormData" && e[Symbol.iterator]);
}
const Ht = (e) => {
  const t = new Array(10), n = (s, r) => {
    if (Q(s)) {
      if (t.indexOf(s) >= 0)
        return;
      if (!("toJSON" in s)) {
        t[r] = s;
        const o = j(s) ? [] : {};
        return H(s, (i, c) => {
          const d = n(i, r + 1);
          !z(d) && (o[c] = d);
        }), t[r] = void 0, o;
      }
    }
    return s;
  };
  return n(e, 0);
}, $t = C("AsyncFunction"), Kt = (e) => e && (Q(e) || x(e)) && x(e.then) && x(e.catch), ze = ((e, t) => e ? setImmediate : t ? ((n, s) => (D.addEventListener("message", ({ source: r, data: o }) => {
  r === D && o === n && s.length && s.shift()();
}, !1), (r) => {
  s.push(r), D.postMessage(n, "*");
}))(`axios@${Math.random()}`, []) : (n) => setTimeout(n))(
  typeof setImmediate == "function",
  x(D.postMessage)
), Jt = typeof queueMicrotask < "u" ? queueMicrotask.bind(D) : typeof process < "u" && process.nextTick || ze, a = {
  isArray: j,
  isArrayBuffer: De,
  isBuffer: lt,
  isFormData: wt,
  isArrayBufferView: ut,
  isString: ft,
  isNumber: Ue,
  isBoolean: dt,
  isObject: Q,
  isPlainObject: J,
  isReadableStream: _t,
  isRequest: St,
  isResponse: Rt,
  isHeaders: Et,
  isUndefined: z,
  isDate: ht,
  isFile: pt,
  isBlob: mt,
  isRegExp: kt,
  isFunction: x,
  isStream: gt,
  isURLSearchParams: bt,
  isTypedArray: Bt,
  isFileList: yt,
  forEach: H,
  merge: ie,
  extend: Ot,
  trim: Tt,
  stripBOM: At,
  inherits: Pt,
  toFlatObject: xt,
  kindOf: X,
  kindOfTest: C,
  endsWith: Ct,
  toArray: Nt,
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
  toFiniteNumber: zt,
  findKey: ke,
  global: D,
  isContextDefined: je,
  ALPHABET: Ie,
  generateString: qt,
  isSpecCompliantForm: vt,
  toJSONObject: Ht,
  isAsyncFn: $t,
  isThenable: Kt,
  setImmediate: ze,
  asap: Jt
};
function g(e, t, n, s, r) {
  Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = e, this.name = "AxiosError", t && (this.code = t), n && (this.config = n), s && (this.request = s), r && (this.response = r, this.status = r.status ? r.status : null);
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
const qe = g.prototype, ve = {};
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
  ve[e] = { value: e };
});
Object.defineProperties(g, ve);
Object.defineProperty(qe, "isAxiosError", { value: !0 });
g.from = (e, t, n, s, r, o) => {
  const i = Object.create(qe);
  return a.toFlatObject(e, i, function(d) {
    return d !== Error.prototype;
  }, (c) => c !== "isAxiosError"), g.call(i, e.message, t, n, s, r), i.cause = e, i.name = e.name, o && Object.assign(i, o), i;
};
const Wt = null;
function oe(e) {
  return a.isPlainObject(e) || a.isArray(e);
}
function He(e) {
  return a.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function _e(e, t, n) {
  return e ? e.concat(t).map(function(r, o) {
    return r = He(r), !n && o ? "[" + r + "]" : r;
  }).join(n ? "." : "") : t;
}
function Vt(e) {
  return a.isArray(e) && !e.some(oe);
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
  const s = n.metaTokens, r = n.visitor || u, o = n.dots, i = n.indexes, d = (n.Blob || typeof Blob < "u" && Blob) && a.isSpecCompliantForm(t);
  if (!a.isFunction(r))
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
    let _ = h;
    if (h && !p && typeof h == "object") {
      if (a.endsWith(m, "{}"))
        m = s ? m : m.slice(0, -2), h = JSON.stringify(h);
      else if (a.isArray(h) && Vt(h) || (a.isFileList(h) || a.endsWith(m, "[]")) && (_ = a.toArray(h)))
        return m = He(m), _.forEach(function(E, N) {
          !(a.isUndefined(E) || E === null) && t.append(
            // eslint-disable-next-line no-nested-ternary
            i === !0 ? _e([m], N, o) : i === null ? m : m + "[]",
            l(E)
          );
        }), !1;
    }
    return oe(h) ? !0 : (t.append(_e(p, m, o), l(h)), !1);
  }
  const f = [], y = Object.assign(Gt, {
    defaultVisitor: u,
    convertValue: l,
    isVisitable: oe
  });
  function w(h, m) {
    if (!a.isUndefined(h)) {
      if (f.indexOf(h) !== -1)
        throw Error("Circular reference detected in " + m.join("."));
      f.push(h), a.forEach(h, function(_, S) {
        (!(a.isUndefined(_) || _ === null) && r.call(
          t,
          _,
          a.isString(S) ? S.trim() : S,
          m,
          y
        )) === !0 && w(_, m ? m.concat(S) : [S]);
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
  return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function(s) {
    return t[s];
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
  const n = t ? function(s) {
    return t.call(this, s, Se);
  } : Se;
  return this._pairs.map(function(r) {
    return n(r[0]) + "=" + n(r[1]);
  }, "").join("&");
};
function Xt(e) {
  return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function Ke(e, t, n) {
  if (!t)
    return e;
  const s = n && n.encode || Xt, r = n && n.serialize;
  let o;
  if (r ? o = r(t, n) : o = a.isURLSearchParams(t) ? t.toString() : new he(t, n).toString(s), o) {
    const i = e.indexOf("#");
    i !== -1 && (e = e.slice(0, i)), e += (e.indexOf("?") === -1 ? "?" : "&") + o;
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
  use(t, n, s) {
    return this.handlers.push({
      fulfilled: t,
      rejected: n,
      synchronous: s ? s.synchronous : !1,
      runWhen: s ? s.runWhen : null
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
    a.forEach(this.handlers, function(s) {
      s !== null && t(s);
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
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", sn = pe && window.location.href || "http://localhost", rn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: pe,
  hasStandardBrowserEnv: tn,
  hasStandardBrowserWebWorkerEnv: nn,
  navigator: ae,
  origin: sn
}, Symbol.toStringTag, { value: "Module" })), A = {
  ...rn,
  ...en
};
function on(e, t) {
  return Z(e, new A.classes.URLSearchParams(), Object.assign({
    visitor: function(n, s, r, o) {
      return A.isNode && a.isBuffer(n) ? (this.append(s, n.toString("base64")), !1) : o.defaultVisitor.apply(this, arguments);
    }
  }, t));
}
function an(e) {
  return a.matchAll(/\w+|\[(\w*)]/g, e).map((t) => t[0] === "[]" ? "" : t[1] || t[0]);
}
function cn(e) {
  const t = {}, n = Object.keys(e);
  let s;
  const r = n.length;
  let o;
  for (s = 0; s < r; s++)
    o = n[s], t[o] = e[o];
  return t;
}
function We(e) {
  function t(n, s, r, o) {
    let i = n[o++];
    if (i === "__proto__") return !0;
    const c = Number.isFinite(+i), d = o >= n.length;
    return i = !i && a.isArray(r) ? r.length : i, d ? (a.hasOwnProp(r, i) ? r[i] = [r[i], s] : r[i] = s, !c) : ((!r[i] || !a.isObject(r[i])) && (r[i] = []), t(n, s, r[i], o) && a.isArray(r[i]) && (r[i] = cn(r[i])), !c);
  }
  if (a.isFormData(e) && a.isFunction(e.entries)) {
    const n = {};
    return a.forEachEntry(e, (s, r) => {
      t(an(s), r, n, 0);
    }), n;
  }
  return null;
}
function ln(e, t, n) {
  if (a.isString(e))
    try {
      return (t || JSON.parse)(e), a.trim(e);
    } catch (s) {
      if (s.name !== "SyntaxError")
        throw s;
    }
  return (0, JSON.stringify)(e);
}
const $ = {
  transitional: Je,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function(t, n) {
    const s = n.getContentType() || "", r = s.indexOf("application/json") > -1, o = a.isObject(t);
    if (o && a.isHTMLForm(t) && (t = new FormData(t)), a.isFormData(t))
      return r ? JSON.stringify(We(t)) : t;
    if (a.isArrayBuffer(t) || a.isBuffer(t) || a.isStream(t) || a.isFile(t) || a.isBlob(t) || a.isReadableStream(t))
      return t;
    if (a.isArrayBufferView(t))
      return t.buffer;
    if (a.isURLSearchParams(t))
      return n.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), t.toString();
    let c;
    if (o) {
      if (s.indexOf("application/x-www-form-urlencoded") > -1)
        return on(t, this.formSerializer).toString();
      if ((c = a.isFileList(t)) || s.indexOf("multipart/form-data") > -1) {
        const d = this.env && this.env.FormData;
        return Z(
          c ? { "files[]": t } : t,
          d && new d(),
          this.formSerializer
        );
      }
    }
    return o || r ? (n.setContentType("application/json", !1), ln(t)) : t;
  }],
  transformResponse: [function(t) {
    const n = this.transitional || $.transitional, s = n && n.forcedJSONParsing, r = this.responseType === "json";
    if (a.isResponse(t) || a.isReadableStream(t))
      return t;
    if (t && a.isString(t) && (s && !this.responseType || r)) {
      const i = !(n && n.silentJSONParsing) && r;
      try {
        return JSON.parse(t);
      } catch (c) {
        if (i)
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
    FormData: A.classes.FormData,
    Blob: A.classes.Blob
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
  $.headers[e] = {};
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
  let n, s, r;
  return e && e.split(`
`).forEach(function(i) {
    r = i.indexOf(":"), n = i.substring(0, r).trim().toLowerCase(), s = i.substring(r + 1).trim(), !(!n || t[n] && un[n]) && (n === "set-cookie" ? t[n] ? t[n].push(s) : t[n] = [s] : t[n] = t[n] ? t[n] + ", " + s : s);
  }), t;
}, Ee = Symbol("internals");
function I(e) {
  return e && String(e).trim().toLowerCase();
}
function W(e) {
  return e === !1 || e == null ? e : a.isArray(e) ? e.map(W) : String(e);
}
function dn(e) {
  const t = /* @__PURE__ */ Object.create(null), n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let s;
  for (; s = n.exec(e); )
    t[s[1]] = s[2];
  return t;
}
const hn = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function ne(e, t, n, s, r) {
  if (a.isFunction(s))
    return s.call(this, t, n);
  if (r && (t = n), !!a.isString(t)) {
    if (a.isString(s))
      return t.indexOf(s) !== -1;
    if (a.isRegExp(s))
      return s.test(t);
  }
}
function pn(e) {
  return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (t, n, s) => n.toUpperCase() + s);
}
function mn(e, t) {
  const n = a.toCamelCase(" " + t);
  ["get", "set", "has"].forEach((s) => {
    Object.defineProperty(e, s + n, {
      value: function(r, o, i) {
        return this[s].call(this, t, r, o, i);
      },
      configurable: !0
    });
  });
}
class P {
  constructor(t) {
    t && this.set(t);
  }
  set(t, n, s) {
    const r = this;
    function o(c, d, l) {
      const u = I(d);
      if (!u)
        throw new Error("header name must be a non-empty string");
      const f = a.findKey(r, u);
      (!f || r[f] === void 0 || l === !0 || l === void 0 && r[f] !== !1) && (r[f || d] = W(c));
    }
    const i = (c, d) => a.forEach(c, (l, u) => o(l, u, d));
    if (a.isPlainObject(t) || t instanceof this.constructor)
      i(t, n);
    else if (a.isString(t) && (t = t.trim()) && !hn(t))
      i(fn(t), n);
    else if (a.isHeaders(t))
      for (const [c, d] of t.entries())
        o(d, c, s);
    else
      t != null && o(n, t, s);
    return this;
  }
  get(t, n) {
    if (t = I(t), t) {
      const s = a.findKey(this, t);
      if (s) {
        const r = this[s];
        if (!n)
          return r;
        if (n === !0)
          return dn(r);
        if (a.isFunction(n))
          return n.call(this, r, s);
        if (a.isRegExp(n))
          return n.exec(r);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(t, n) {
    if (t = I(t), t) {
      const s = a.findKey(this, t);
      return !!(s && this[s] !== void 0 && (!n || ne(this, this[s], s, n)));
    }
    return !1;
  }
  delete(t, n) {
    const s = this;
    let r = !1;
    function o(i) {
      if (i = I(i), i) {
        const c = a.findKey(s, i);
        c && (!n || ne(s, s[c], c, n)) && (delete s[c], r = !0);
      }
    }
    return a.isArray(t) ? t.forEach(o) : o(t), r;
  }
  clear(t) {
    const n = Object.keys(this);
    let s = n.length, r = !1;
    for (; s--; ) {
      const o = n[s];
      (!t || ne(this, this[o], o, t, !0)) && (delete this[o], r = !0);
    }
    return r;
  }
  normalize(t) {
    const n = this, s = {};
    return a.forEach(this, (r, o) => {
      const i = a.findKey(s, o);
      if (i) {
        n[i] = W(r), delete n[o];
        return;
      }
      const c = t ? pn(o) : String(o).trim();
      c !== o && delete n[o], n[c] = W(r), s[c] = !0;
    }), this;
  }
  concat(...t) {
    return this.constructor.concat(this, ...t);
  }
  toJSON(t) {
    const n = /* @__PURE__ */ Object.create(null);
    return a.forEach(this, (s, r) => {
      s != null && s !== !1 && (n[r] = t && a.isArray(s) ? s.join(", ") : s);
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
    const s = new this(t);
    return n.forEach((r) => s.set(r)), s;
  }
  static accessor(t) {
    const s = (this[Ee] = this[Ee] = {
      accessors: {}
    }).accessors, r = this.prototype;
    function o(i) {
      const c = I(i);
      s[c] || (mn(r, i), s[c] = !0);
    }
    return a.isArray(t) ? t.forEach(o) : o(t), this;
  }
}
P.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
a.reduceDescriptors(P.prototype, ({ value: e }, t) => {
  let n = t[0].toUpperCase() + t.slice(1);
  return {
    get: () => e,
    set(s) {
      this[n] = s;
    }
  };
});
a.freezeMethods(P);
function se(e, t) {
  const n = this || $, s = t || n, r = P.from(s.headers);
  let o = s.data;
  return a.forEach(e, function(c) {
    o = c.call(n, o, r.normalize(), t ? t.status : void 0);
  }), r.normalize(), o;
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
  const s = n.config.validateStatus;
  !n.status || !s || s(n.status) ? e(n) : t(new g(
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
  const n = new Array(e), s = new Array(e);
  let r = 0, o = 0, i;
  return t = t !== void 0 ? t : 1e3, function(d) {
    const l = Date.now(), u = s[o];
    i || (i = l), n[r] = d, s[r] = l;
    let f = o, y = 0;
    for (; f !== r; )
      y += n[f++], f = f % e;
    if (r = (r + 1) % e, r === o && (o = (o + 1) % e), l - i < t)
      return;
    const w = u && l - u;
    return w ? Math.round(y * 1e3 / w) : void 0;
  };
}
function wn(e, t) {
  let n = 0, s = 1e3 / t, r, o;
  const i = (l, u = Date.now()) => {
    n = u, r = null, o && (clearTimeout(o), o = null), e.apply(null, l);
  };
  return [(...l) => {
    const u = Date.now(), f = u - n;
    f >= s ? i(l, u) : (r = l, o || (o = setTimeout(() => {
      o = null, i(r);
    }, s - f)));
  }, () => r && i(r)];
}
const V = (e, t, n = 3) => {
  let s = 0;
  const r = gn(50, 250);
  return wn((o) => {
    const i = o.loaded, c = o.lengthComputable ? o.total : void 0, d = i - s, l = r(d), u = i <= c;
    s = i;
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
}, Te = (e, t) => {
  const n = e != null;
  return [(s) => t[0]({
    lengthComputable: n,
    total: e,
    loaded: s
  }), t[1]];
}, Oe = (e) => (...t) => a.asap(() => e(...t)), bn = A.hasStandardBrowserEnv ? (
  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  function() {
    const t = A.navigator && /(msie|trident)/i.test(A.navigator.userAgent), n = document.createElement("a");
    let s;
    function r(o) {
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
    return s = r(window.location.href), function(i) {
      const c = a.isString(i) ? r(i) : i;
      return c.protocol === s.protocol && c.host === s.host;
    };
  }()
) : (
  // Non standard browser envs (web workers, react-native) lack needed support.
  /* @__PURE__ */ function() {
    return function() {
      return !0;
    };
  }()
), _n = A.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(e, t, n, s, r, o) {
      const i = [e + "=" + encodeURIComponent(t)];
      a.isNumber(n) && i.push("expires=" + new Date(n).toGMTString()), a.isString(s) && i.push("path=" + s), a.isString(r) && i.push("domain=" + r), o === !0 && i.push("secure"), document.cookie = i.join("; ");
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
const Ae = (e) => e instanceof P ? { ...e } : e;
function k(e, t) {
  t = t || {};
  const n = {};
  function s(l, u, f) {
    return a.isPlainObject(l) && a.isPlainObject(u) ? a.merge.call({ caseless: f }, l, u) : a.isPlainObject(u) ? a.merge({}, u) : a.isArray(u) ? u.slice() : u;
  }
  function r(l, u, f) {
    if (a.isUndefined(u)) {
      if (!a.isUndefined(l))
        return s(void 0, l, f);
    } else return s(l, u, f);
  }
  function o(l, u) {
    if (!a.isUndefined(u))
      return s(void 0, u);
  }
  function i(l, u) {
    if (a.isUndefined(u)) {
      if (!a.isUndefined(l))
        return s(void 0, l);
    } else return s(void 0, u);
  }
  function c(l, u, f) {
    if (f in t)
      return s(l, u);
    if (f in e)
      return s(void 0, l);
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
    headers: (l, u) => r(Ae(l), Ae(u), !0)
  };
  return a.forEach(Object.keys(Object.assign({}, e, t)), function(u) {
    const f = d[u] || r, y = f(e[u], t[u], u);
    a.isUndefined(y) && f !== c || (n[u] = y);
  }), n;
}
const Ye = (e) => {
  const t = k({}, e);
  let { data: n, withXSRFToken: s, xsrfHeaderName: r, xsrfCookieName: o, headers: i, auth: c } = t;
  t.headers = i = P.from(i), t.url = Ke(Xe(t.baseURL, t.url), e.params, e.paramsSerializer), c && i.set(
    "Authorization",
    "Basic " + btoa((c.username || "") + ":" + (c.password ? unescape(encodeURIComponent(c.password)) : ""))
  );
  let d;
  if (a.isFormData(n)) {
    if (A.hasStandardBrowserEnv || A.hasStandardBrowserWebWorkerEnv)
      i.setContentType(void 0);
    else if ((d = i.getContentType()) !== !1) {
      const [l, ...u] = d ? d.split(";").map((f) => f.trim()).filter(Boolean) : [];
      i.setContentType([l || "multipart/form-data", ...u].join("; "));
    }
  }
  if (A.hasStandardBrowserEnv && (s && a.isFunction(s) && (s = s(t)), s || s !== !1 && bn(t.url))) {
    const l = r && o && _n.read(o);
    l && i.set(r, l);
  }
  return t;
}, En = typeof XMLHttpRequest < "u", Tn = En && function(e) {
  return new Promise(function(n, s) {
    const r = Ye(e);
    let o = r.data;
    const i = P.from(r.headers).normalize();
    let { responseType: c, onUploadProgress: d, onDownloadProgress: l } = r, u, f, y, w, h;
    function m() {
      w && w(), h && h(), r.cancelToken && r.cancelToken.unsubscribe(u), r.signal && r.signal.removeEventListener("abort", u);
    }
    let p = new XMLHttpRequest();
    p.open(r.method.toUpperCase(), r.url, !0), p.timeout = r.timeout;
    function _() {
      if (!p)
        return;
      const E = P.from(
        "getAllResponseHeaders" in p && p.getAllResponseHeaders()
      ), T = {
        data: !c || c === "text" || c === "json" ? p.responseText : p.response,
        status: p.status,
        statusText: p.statusText,
        headers: E,
        config: e,
        request: p
      };
      Ge(function(L) {
        n(L), m();
      }, function(L) {
        s(L), m();
      }, T), p = null;
    }
    "onloadend" in p ? p.onloadend = _ : p.onreadystatechange = function() {
      !p || p.readyState !== 4 || p.status === 0 && !(p.responseURL && p.responseURL.indexOf("file:") === 0) || setTimeout(_);
    }, p.onabort = function() {
      p && (s(new g("Request aborted", g.ECONNABORTED, e, p)), p = null);
    }, p.onerror = function() {
      s(new g("Network Error", g.ERR_NETWORK, e, p)), p = null;
    }, p.ontimeout = function() {
      let N = r.timeout ? "timeout of " + r.timeout + "ms exceeded" : "timeout exceeded";
      const T = r.transitional || Je;
      r.timeoutErrorMessage && (N = r.timeoutErrorMessage), s(new g(
        N,
        T.clarifyTimeoutError ? g.ETIMEDOUT : g.ECONNABORTED,
        e,
        p
      )), p = null;
    }, o === void 0 && i.setContentType(null), "setRequestHeader" in p && a.forEach(i.toJSON(), function(N, T) {
      p.setRequestHeader(T, N);
    }), a.isUndefined(r.withCredentials) || (p.withCredentials = !!r.withCredentials), c && c !== "json" && (p.responseType = r.responseType), l && ([y, h] = V(l, !0), p.addEventListener("progress", y)), d && p.upload && ([f, w] = V(d), p.upload.addEventListener("progress", f), p.upload.addEventListener("loadend", w)), (r.cancelToken || r.signal) && (u = (E) => {
      p && (s(!E || E.type ? new M(null, e, p) : E), p.abort(), p = null);
    }, r.cancelToken && r.cancelToken.subscribe(u), r.signal && (r.signal.aborted ? u() : r.signal.addEventListener("abort", u)));
    const S = yn(r.url);
    if (S && A.protocols.indexOf(S) === -1) {
      s(new g("Unsupported protocol " + S + ":", g.ERR_BAD_REQUEST, e));
      return;
    }
    p.send(o || null);
  });
}, On = (e, t) => {
  const { length: n } = e = e ? e.filter(Boolean) : [];
  if (t || n) {
    let s = new AbortController(), r;
    const o = function(l) {
      if (!r) {
        r = !0, c();
        const u = l instanceof Error ? l : this.reason;
        s.abort(u instanceof g ? u : new M(u instanceof Error ? u.message : u));
      }
    };
    let i = t && setTimeout(() => {
      i = null, o(new g(`timeout ${t} of ms exceeded`, g.ETIMEDOUT));
    }, t);
    const c = () => {
      e && (i && clearTimeout(i), i = null, e.forEach((l) => {
        l.unsubscribe ? l.unsubscribe(o) : l.removeEventListener("abort", o);
      }), e = null);
    };
    e.forEach((l) => l.addEventListener("abort", o));
    const { signal: d } = s;
    return d.unsubscribe = () => a.asap(c), d;
  }
}, An = function* (e, t) {
  let n = e.byteLength;
  if (n < t) {
    yield e;
    return;
  }
  let s = 0, r;
  for (; s < n; )
    r = s + t, yield e.slice(s, r), s = r;
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
      const { done: n, value: s } = await t.read();
      if (n)
        break;
      yield s;
    }
  } finally {
    await t.cancel();
  }
}, Pe = (e, t, n, s) => {
  const r = Pn(e, t);
  let o = 0, i, c = (d) => {
    i || (i = !0, s && s(d));
  };
  return new ReadableStream({
    async pull(d) {
      try {
        const { done: l, value: u } = await r.next();
        if (l) {
          c(), d.close();
          return;
        }
        let f = u.byteLength;
        if (n) {
          let y = o += f;
          n(y);
        }
        d.enqueue(new Uint8Array(u));
      } catch (l) {
        throw c(l), l;
      }
    },
    cancel(d) {
      return c(d), r.return();
    }
  }, {
    highWaterMark: 2
  });
}, ee = typeof fetch == "function" && typeof Request == "function" && typeof Response == "function", Qe = ee && typeof ReadableStream == "function", Cn = ee && (typeof TextEncoder == "function" ? /* @__PURE__ */ ((e) => (t) => e.encode(t))(new TextEncoder()) : async (e) => new Uint8Array(await new Response(e).arrayBuffer())), Ze = (e, ...t) => {
  try {
    return !!e(...t);
  } catch {
    return !1;
  }
}, Nn = Qe && Ze(() => {
  let e = !1;
  const t = new Request(A.origin, {
    body: new ReadableStream(),
    method: "POST",
    get duplex() {
      return e = !0, "half";
    }
  }).headers.has("Content-Type");
  return e && !t;
}), xe = 64 * 1024, ce = Qe && Ze(() => a.isReadableStream(new Response("").body)), G = {
  stream: ce && ((e) => e.body)
};
ee && ((e) => {
  ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((t) => {
    !G[t] && (G[t] = a.isFunction(e[t]) ? (n) => n[t]() : (n, s) => {
      throw new g(`Response type '${t}' is not supported`, g.ERR_NOT_SUPPORT, s);
    });
  });
})(new Response());
const Bn = async (e) => {
  if (e == null)
    return 0;
  if (a.isBlob(e))
    return e.size;
  if (a.isSpecCompliantForm(e))
    return (await new Request(A.origin, {
      method: "POST",
      body: e
    }).arrayBuffer()).byteLength;
  if (a.isArrayBufferView(e) || a.isArrayBuffer(e))
    return e.byteLength;
  if (a.isURLSearchParams(e) && (e = e + ""), a.isString(e))
    return (await Cn(e)).byteLength;
}, Fn = async (e, t) => {
  const n = a.toFiniteNumber(e.getContentLength());
  return n ?? Bn(t);
}, Ln = ee && (async (e) => {
  let {
    url: t,
    method: n,
    data: s,
    signal: r,
    cancelToken: o,
    timeout: i,
    onDownloadProgress: c,
    onUploadProgress: d,
    responseType: l,
    headers: u,
    withCredentials: f = "same-origin",
    fetchOptions: y
  } = Ye(e);
  l = l ? (l + "").toLowerCase() : "text";
  let w = On([r, o && o.toAbortSignal()], i), h;
  const m = w && w.unsubscribe && (() => {
    w.unsubscribe();
  });
  let p;
  try {
    if (d && Nn && n !== "get" && n !== "head" && (p = await Fn(u, s)) !== 0) {
      let T = new Request(t, {
        method: "POST",
        body: s,
        duplex: "half"
      }), B;
      if (a.isFormData(s) && (B = T.headers.get("content-type")) && u.setContentType(B), T.body) {
        const [L, K] = Te(
          p,
          V(Oe(d))
        );
        s = Pe(T.body, xe, L, K);
      }
    }
    a.isString(f) || (f = f ? "include" : "omit");
    const _ = "credentials" in Request.prototype;
    h = new Request(t, {
      ...y,
      signal: w,
      method: n.toUpperCase(),
      headers: u.normalize().toJSON(),
      body: s,
      duplex: "half",
      credentials: _ ? f : void 0
    });
    let S = await fetch(h);
    const E = ce && (l === "stream" || l === "response");
    if (ce && (c || E && m)) {
      const T = {};
      ["status", "statusText", "headers"].forEach((ge) => {
        T[ge] = S[ge];
      });
      const B = a.toFiniteNumber(S.headers.get("content-length")), [L, K] = c && Te(
        B,
        V(Oe(c), !0)
      ) || [];
      S = new Response(
        Pe(S.body, xe, L, () => {
          K && K(), m && m();
        }),
        T
      );
    }
    l = l || "text";
    let N = await G[a.findKey(G, l) || "text"](S, e);
    return !E && m && m(), await new Promise((T, B) => {
      Ge(T, B, {
        data: N,
        headers: P.from(S.headers),
        status: S.status,
        statusText: S.statusText,
        config: e,
        request: h
      });
    });
  } catch (_) {
    throw m && m(), _ && _.name === "TypeError" && /fetch/i.test(_.message) ? Object.assign(
      new g("Network Error", g.ERR_NETWORK, e, h),
      {
        cause: _.cause || _
      }
    ) : g.from(_, _ && _.code, e, h);
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
const Ce = (e) => `- ${e}`, Dn = (e) => a.isFunction(e) || e === null || e === !1, et = {
  getAdapter: (e) => {
    e = a.isArray(e) ? e : [e];
    const { length: t } = e;
    let n, s;
    const r = {};
    for (let o = 0; o < t; o++) {
      n = e[o];
      let i;
      if (s = n, !Dn(n) && (s = le[(i = String(n)).toLowerCase()], s === void 0))
        throw new g(`Unknown adapter '${i}'`);
      if (s)
        break;
      r[i || "#" + o] = s;
    }
    if (!s) {
      const o = Object.entries(r).map(
        ([c, d]) => `adapter ${c} ` + (d === !1 ? "is not supported by the environment" : "is not available in the build")
      );
      let i = t ? o.length > 1 ? `since :
` + o.map(Ce).join(`
`) : " " + Ce(o[0]) : "as no adapter specified";
      throw new g(
        "There is no suitable adapter to dispatch the request " + i,
        "ERR_NOT_SUPPORT"
      );
    }
    return s;
  },
  adapters: le
};
function re(e) {
  if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)
    throw new M(null, e);
}
function Ne(e) {
  return re(e), e.headers = P.from(e.headers), e.data = se.call(
    e,
    e.transformRequest
  ), ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), et.getAdapter(e.adapter || $.adapter)(e).then(function(s) {
    return re(e), s.data = se.call(
      e,
      e.transformResponse,
      s
    ), s.headers = P.from(s.headers), s;
  }, function(s) {
    return Ve(s) || (re(e), s && s.response && (s.response.data = se.call(
      e,
      e.transformResponse,
      s.response
    ), s.response.headers = P.from(s.response.headers))), Promise.reject(s);
  });
}
const tt = "1.7.7", me = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((e, t) => {
  me[e] = function(s) {
    return typeof s === e || "a" + (t < 1 ? "n " : " ") + e;
  };
});
const Be = {};
me.transitional = function(t, n, s) {
  function r(o, i) {
    return "[Axios v" + tt + "] Transitional option '" + o + "'" + i + (s ? ". " + s : "");
  }
  return (o, i, c) => {
    if (t === !1)
      throw new g(
        r(i, " has been removed" + (n ? " in " + n : "")),
        g.ERR_DEPRECATED
      );
    return n && !Be[i] && (Be[i] = !0, console.warn(
      r(
        i,
        " has been deprecated since v" + n + " and will be removed in the near future"
      )
    )), t ? t(o, i, c) : !0;
  };
};
function Un(e, t, n) {
  if (typeof e != "object")
    throw new g("options must be an object", g.ERR_BAD_OPTION_VALUE);
  const s = Object.keys(e);
  let r = s.length;
  for (; r-- > 0; ) {
    const o = s[r], i = t[o];
    if (i) {
      const c = e[o], d = c === void 0 || i(c, o, e);
      if (d !== !0)
        throw new g("option " + o + " must be " + d, g.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (n !== !0)
      throw new g("Unknown option " + o, g.ERR_BAD_OPTION);
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
    } catch (s) {
      if (s instanceof Error) {
        let r;
        Error.captureStackTrace ? Error.captureStackTrace(r = {}) : r = new Error();
        const o = r.stack ? r.stack.replace(/^.+\n/, "") : "";
        try {
          s.stack ? o && !String(s.stack).endsWith(o.replace(/^.+\n.+\n/, "")) && (s.stack += `
` + o) : s.stack = o;
        } catch {
        }
      }
      throw s;
    }
  }
  _request(t, n) {
    typeof t == "string" ? (n = n || {}, n.url = t) : n = t || {}, n = k(this.defaults, n);
    const { transitional: s, paramsSerializer: r, headers: o } = n;
    s !== void 0 && ue.assertOptions(s, {
      silentJSONParsing: F.transitional(F.boolean),
      forcedJSONParsing: F.transitional(F.boolean),
      clarifyTimeoutError: F.transitional(F.boolean)
    }, !1), r != null && (a.isFunction(r) ? n.paramsSerializer = {
      serialize: r
    } : ue.assertOptions(r, {
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
    ), n.headers = P.concat(i, o);
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
      const h = [Ne.bind(this), void 0];
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
      u = Ne.call(this, w);
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
  U.prototype[t] = function(n, s) {
    return this.request(k(s || {}, {
      method: t,
      url: n,
      data: (s || {}).data
    }));
  };
});
a.forEach(["post", "put", "patch"], function(t) {
  function n(s) {
    return function(o, i, c) {
      return this.request(k(c || {}, {
        method: t,
        headers: s ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: o,
        data: i
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
    this.promise = new Promise(function(o) {
      n = o;
    });
    const s = this;
    this.promise.then((r) => {
      if (!s._listeners) return;
      let o = s._listeners.length;
      for (; o-- > 0; )
        s._listeners[o](r);
      s._listeners = null;
    }), this.promise.then = (r) => {
      let o;
      const i = new Promise((c) => {
        s.subscribe(c), o = c;
      }).then(r);
      return i.cancel = function() {
        s.unsubscribe(o);
      }, i;
    }, t(function(o, i, c) {
      s.reason || (s.reason = new M(o, i, c), n(s.reason));
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
    const t = new AbortController(), n = (s) => {
      t.abort(s);
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
      token: new ye(function(r) {
        t = r;
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
  return a.extend(n, U.prototype, t, { allOwnKeys: !0 }), a.extend(n, t, null, { allOwnKeys: !0 }), n.create = function(r) {
    return nt(k(e, r));
  }, n;
}
const R = nt($);
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
R.AxiosHeaders = P;
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
  constructor(t, n, s, r, o, i) {
    b(this, "_gptKey");
    b(this, "_searchKey");
    b(this, "_searchSecret");
    b(this, "_doc");
    b(this, "_client");
    b(this, "_initialized", !1);
    this._gptKey = t, this._searchKey = o, this._searchSecret = i, this._doc = new q(n, {
      disableGC: !0
    }), this._client = new v(`https://${r}`, {
      apiKey: s
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
  async generate(t, n = 0, s) {
    this._client.changeSyncMode(this._doc, O.RealtimePushOnly);
    const r = await this._fetch(t);
    if (!r.length) {
      this._client.changeSyncMode(this._doc, O.Realtime);
      return;
    }
    const { link: o } = r[0], { displayFormat: i, domain: c, fileName: d, fileSize: l, format: u, height: f, internalResource: y, originalHeight: w, originalWidth: h, path: m, width: p } = await s(o), _ = {
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
    this._doc.update((S) => {
      S.text.editByPath([n], [n], _);
    }), this._client.changeSyncMode(this._doc, O.Realtime);
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
    return console.log(o), (await R.get("https://cors-anywhere.herokuapp.com/https://openapi.naver.com/v1/search/image", {
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
  constructor(t, n, s, r) {
    b(this, "_gptKey");
    b(this, "_doc");
    b(this, "_client");
    b(this, "_initialized", !1);
    this._gptKey = t, this._doc = new q(n, {
      disableGC: !0
    }), this._client = new v(`https://${r}`, {
      apiKey: s
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
  async generate(t, n = 0, s) {
    this._client.changeSyncMode(this._doc, O.RealtimePushOnly);
    const r = await this._fetch(t);
    if (!r.length) {
      this._client.changeSyncMode(this._doc, O.Realtime);
      return;
    }
    const { displayFormat: o, domain: i, fileName: c, fileSize: d, format: l, height: u, internalResource: f, originalHeight: y, originalWidth: w, path: h, width: m } = await s(r), p = {
      attributes: {
        "@ctype": "image",
        contentMode: "normal",
        imageData: {
          displayFormat: o,
          domain: i,
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
          src: i + h,
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
    this._doc.update((_) => {
      _.text.editByPath([n], [n], p);
    }), this._client.changeSyncMode(this._doc, O.Realtime);
  }
  async _fetch(t) {
    const n = [
      { role: "system", content: "지금부터 내가 입력하는 텍스트에서 키워드를 뽑아서 dall e 에서 사진 생성이 가능하도록 키워드를 뽑아줘" },
      {
        role: "user",
        content: t
      }
    ], r = await (await fetch("https://api.openai.com/v1/chat/completions", {
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
    })).json(), { content: o } = r.choices[0].message;
    console.log(r);
    const i = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this._gptKey}`
      },
      body: JSON.stringify({
        prompt: o,
        n: 1,
        // 이미지 개수
        size: "1024x1024"
        // 이미지 크기
      })
    });
    if (!i.ok)
      throw new Error(`Error: ${i.statusText}`);
    const c = await i.json(), d = c.data[0].url;
    return console.log(c), d;
  }
}
const zn = 150, qn = {
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
  constructor(t, n, s, r) {
    b(this, "_gptKey");
    b(this, "_initialized", !1);
    b(this, "_messages", [
      {
        role: "system",
        content: "지금부터 내가 입력하는 문장을 영어로 번역해줘. 너의 대답은 번역된 텍스트만 포함하고 있어야해. 다른 말은 추가하면 안돼. 그리고 너의 답변에 개행문자가 들어가면 안돼. 하나의 문장으로 답변해."
      }
    ]);
    b(this, "_doc");
    b(this, "_client");
    this._gptKey = t, this._doc = new q(n, {
      disableGC: !0
    }), this._client = new v(`https://${r}`, {
      apiKey: s
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
    this._client.changeSyncMode(this._doc, O.RealtimePushOnly);
    const s = await this._fetch(t), { content: r } = s.choices[0].message;
    if (!r.length) {
      this._client.changeSyncMode(this._doc, O.Realtime);
      return;
    }
    const o = r.split(`
`).flatMap((f) => {
      let y = 0;
      const w = [""];
      for (; y < f.length; )
        w.push(f.slice(y, y + 3)), y += 3;
      return w;
    });
    let i = 0, c = 0;
    const d = n[0];
    let l = n[1];
    const u = () => {
      o[i] === "" ? this._doc.update((f) => {
        f.text.editByPath(
          [d, l],
          [d, l],
          qn
        );
      }) : o[i].length && this._doc.update((f, y) => {
        const w = [d, l, 0, c];
        f.text.editByPath(w, w, {
          type: "text",
          value: o[i]
        });
        const h = [
          d,
          l,
          0,
          c + o[i].length
        ];
        y.set({
          selections: [
            f.text.pathRangeToPosRange([h, h])
          ],
          userId: "translator"
        }), c += o[i].length;
      }), i++, setTimeout(() => {
        if (i < o.length)
          u();
        else
          return this._client.changeSyncMode(this._doc, O.Realtime), this._doc.update((f, y) => {
            y.set({
              userId: "gpt",
              selections: [
                f.text.pathRangeToPosRange([[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]])
              ]
            });
          }), Promise.resolve();
      }, zn);
    };
    u();
  }
  async _fetch(t) {
    this._messages.push({ role: "user", content: t });
    const s = await (await fetch("https://api.openai.com/v1/chat/completions", {
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
      content: s.choices[0].message.content
    }), s;
  }
}
class Vn {
  constructor(t, n, s, r) {
    b(this, "_gptKey");
    b(this, "_initialized", !1);
    b(this, "_messages", [
      {
        role: "system",
        content: "지금부터 내가 입력하는 문장의 맞춤법을 교정해줘. 너의 대답은 교정된 텍스트만 포함하고 있어야해. 다른 말은 추가하면 안돼. 그리고 너의 답변에 개행문자가 들어가면 안돼. 하나의 문장으로 답변해."
      }
    ]);
    b(this, "_doc");
    b(this, "_client");
    this._gptKey = t, this._doc = new q(n, {
      disableGC: !0
    }), this._client = new v(`https://${r}`, {
      apiKey: s
    });
  }
  /** */
  async initialize() {
    if (this._initialized)
      return Promise.resolve();
    try {
      await this._client.activate(), await this._client.attach(this._doc, {
        initialPresence: { userId: "spellChecker" }
      }), this._initialized = !0;
    } catch {
      return !1;
    }
    return Promise.resolve();
  }
  /**
   *
   */
  async generate(t, n, s) {
    this._client.changeSyncMode(this._doc, O.RealtimePushOnly);
    const r = await this._fetch(t), { content: o } = r.choices[0].message;
    o.length && (this._client.changeSyncMode(this._doc, O.RealtimePushOnly), this._doc.update((i, c) => {
      i.text.editByPath(n, s, {
        type: "text",
        value: o
      });
      const d = [...s];
      d.pop(), d.push(o.length), c.set({
        userId: "spellChecker",
        selections: [
          i.text.pathRangeToPosRange([n, d])
        ]
      });
    }), setTimeout(() => {
      this._doc.update((i, c) => {
        c.set({
          userId: "spellChecker",
          selections: [
            i.text.pathRangeToPosRange([[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]])
          ]
        });
      });
    }, 1500));
  }
  async _fetch(t) {
    this._messages.push({ role: "user", content: t });
    const s = await (await fetch("https://api.openai.com/v1/chat/completions", {
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
      content: s.choices[0].message.content
    }), s;
  }
}
export {
  Jn as AIImageGenerator,
  Kn as AIImageSearch,
  Vn as AISpellChecker,
  Wn as AITranslator,
  $n as AIWriter
};
