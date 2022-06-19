/*!
// ==UserScript==
// @name              vocabulary-helper
// @version           1.0.0
// @description       A Tampermonkey Plugin for search vocabulary.
// @author            Thinker-ljn
// @require           https://unpkg.com/vue@3.2.37
// @require           https://unpkg.com/@vueuse/core@8.7.4
// @require           https://unpkg.com/@vueuse/shared@8.7.4
// @require           https://unpkg.com/axios@0.26.1
// @require           https://unpkg.com/lodash@4.17.21/lodash.js
// @require           https://unpkg.com/@juggle/resize-observer@3.3.1
// @require           data:text/javascript;base64,dGhpcy5nbG9iYWxUaGlzPXRoaXM7dGhpcy5WdWU9VnVlOw==
// @require           https://unpkg.com/naive-ui@2.30.4/dist/index.prod.js
// @require           https://unpkg.com/axios-userscript-adapter@0.2.0/dist/axiosGmxhrAdapter.min.js
// @match             https://www.vocabulary.com/*
// @connect           www.vocabulary.com
// @run-at            document-body
// @grant             GM.xmlHttpRequest
// @grant             GM_addStyle
// ==/UserScript==
*/
(function(vue, naiveUi, axios2, gmxhrAdapter) {
  "use strict";
  GM_addStyle("html,\nbody,\n#app {\n  height: 100%;\n  margin: 0;\n  padding: 0;\n}\n@font-face {\n  font-family: 'DM Mono';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/dmmono/v10/aFTU7PB1QTsUX8KYhh0.ttf) format('truetype');\n}\n@font-face {\n  font-family: 'DM Sans';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/dmsans/v11/rP2Hp2ywxg089UriOZQ.ttf) format('truetype');\n}\n@font-face {\n  font-family: 'DM Serif Display';\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/dmserifdisplay/v10/-nFnOHM81r4j6k0gjAW3mujVU2B2K_c.ttf) format('truetype');\n}\n.i-ion-close-round,[i-ion-close-round=\"\"]{--un-icon:url(\"data:image/svg+xml;utf8,%3Csvg preserveAspectRatio='xMidYMid meet' viewBox='0 0 512 512' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath d='M437.5 386.6L306.9 256l130.6-130.6c14.1-14.1 14.1-36.8 0-50.9-14.1-14.1-36.8-14.1-50.9 0L256 205.1 125.4 74.5c-14.1-14.1-36.8-14.1-50.9 0-14.1 14.1-14.1 36.8 0 50.9L205.1 256 74.5 386.6c-14.1 14.1-14.1 36.8 0 50.9 14.1 14.1 36.8 14.1 50.9 0L256 306.9l130.6 130.6c14.1 14.1 36.8 14.1 50.9 0 14-14.1 14-36.9 0-50.9z' fill='currentColor'/%3E%3C/svg%3E\");mask:var(--un-icon) no-repeat;mask-size:100% 100%;-webkit-mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;background-color:currentColor;width:1.2em;height:1.2em;}.absolute{position:absolute;}.right-2{right:0.5rem;}.top-2{top:0.5rem;}.my-2{margin-top:0.5rem;margin-bottom:0.5rem;}.mb-1{margin-bottom:0.25rem;}.mr-2{margin-right:0.5rem;}.max-h-140{max-height:35rem;}.max-w-120{max-width:30rem;}.min-w-20{min-width:5rem;}.flex{display:flex;}.cursor-pointer{cursor:pointer;}.overflow-auto{overflow:auto;}.border{border-width:1px;border-style:solid;}.p-2{padding:0.5rem;}.text-right{text-align:right;}.text-xl{font-size:1.25rem;line-height:1.75rem;}");
  function _interopDefaultLegacy(e) {
    return e && typeof e === "object" && "default" in e ? e : { "default": e };
  }
  var axios__default = /* @__PURE__ */ _interopDefaultLegacy(axios2);
  var gmxhrAdapter__default = /* @__PURE__ */ _interopDefaultLegacy(gmxhrAdapter);
  function getClickText() {
    const selection = window.getSelection();
    if (!selection)
      return "";
    const node = selection.anchorNode;
    if (!node)
      return "";
    const range = selection.getRangeAt(0);
    const padding = () => /[^\w\-]/.test(range.toString());
    const leftEdge = () => range.startOffset === 0 || padding();
    const rightEdge = () => range.endOffset === node.length || padding();
    while (!leftEdge())
      range.setStart(node, range.startOffset - 1);
    if (padding())
      range.setStart(node, range.startOffset + 1);
    while (!rightEdge())
      range.setEnd(node, range.endOffset + 1);
    if (padding())
      range.setEnd(node, range.endOffset - 1);
    const str = range.toString().trim();
    selection.removeAllRanges();
    return str;
  }
  let id = 0;
  function useClickText(callback) {
    function onClick(e) {
      if (!e.ctrlKey)
        return;
      e.preventDefault();
      const text2 = getClickText();
      callback(text2 ? {
        id: id++,
        text: text2,
        pos: {
          x: e.clientX,
          y: e.clientY
        }
      } : null);
    }
    const close = (e) => {
      if (e.key === "Escape")
        callback(null);
    };
    vue.onMounted(() => {
      document.addEventListener("click", onClick);
      document.addEventListener("keyup", close);
    });
    vue.onBeforeUnmount(() => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keyup", close);
    });
  }
  function parseHtml(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc;
  }
  function asyncParseHtml(html) {
    return html.then(parseHtml);
  }
  const service = axios__default["default"].create({
    adapter: gmxhrAdapter__default["default"]
  });
  service.interceptors.response.use((res) => {
    return res.data;
  });
  async function getHTMLDOM(url) {
    return !url || location.href === url ? document : asyncParseHtml(getHTML(url));
  }
  function getHTML(url) {
    return service({
      url,
      responseType: "text"
    });
  }
  function Q(dom) {
    const tool = {
      q(str) {
        return dom.querySelector(str);
      },
      qa(str) {
        return Array.from(dom.querySelectorAll(str));
      },
      t(str) {
        var _a;
        return ((_a = tool.q(str)) == null ? void 0 : _a.textContent) || "";
      }
    };
    return tool;
  }
  function text(str) {
    return (str || "").trim();
  }
  function useSearch() {
    const moreDefContentParser = (el2) => {
      const [detail, ...dds] = Array.from(el2.children || []);
      return {
        detail: detail.textContent || "",
        dds: dds.map((e) => {
          var _a;
          return {
            words: Array.from(e.querySelectorAll(".word")).map((ee) => text(ee.textContent)),
            definition: text((_a = e.querySelector(".definition")) == null ? void 0 : _a.textContent)
          };
        })
      };
    };
    const definitionParser = (el2) => {
      var _a, _b, _c, _d;
      const more = Array.from(el2.querySelectorAll(".defContent .instances"));
      const examples = Array.from(el2.querySelectorAll(".defContent .example")).map((el22) => text(el22.textContent));
      const d = {
        classes: ((_b = (_a = el2.firstElementChild) == null ? void 0 : _a.firstElementChild) == null ? void 0 : _b.textContent) || "",
        definition: text((_d = (_c = el2.firstElementChild) == null ? void 0 : _c.lastChild) == null ? void 0 : _d.textContent),
        examples,
        more: more.map(moreDefContentParser)
      };
      return d;
    };
    function unescape(str) {
      const el2 = document.createElement("div");
      el2.innerHTML = str;
      return el2.textContent || "";
    }
    function encounter({ word, freq, ffreq }) {
      const pages = ffreq ? (1 + parseInt(`${1 / (ffreq / 4e3)}`)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;
      const tips = ffreq ? ffreq === freq ? `\u4F60\u6BCF\u5927\u7EA6\u6D4F\u89C8${pages}\u9875\u5C31\u53EF\u80FD\u9047\u5230\u8FD9\u4E2A\u5355\u8BCD${word}` : `\u4F60\u6BCF\u5927\u7EA6\u6D4F\u89C8${pages}\u9875\u5C31\u53EF\u80FD\u9047\u5230\u8FD9\u4E2A\u5355\u8BCD${word}\u7684\u53D8\u4F53` : `\u4F60\u57FA\u672C\u4E0A\u9047\u4E0D\u5230\u8FD9\u4E2A\u5355\u8BCD${word}`;
      return {
        word,
        pages,
        tips
      };
    }
    const parsefamilys = (el2) => {
      const [, data = ""] = (el2 == null ? void 0 : el2.innerHTML.match(/<vcom:wordfamily.*?data="([^"]+)"/)) || [];
      return (JSON.parse(unescape(data)) || []).map((item) => encounter(item));
    };
    const search = (input) => {
      return getHTMLDOM(`https://www.vocabulary.com/dictionary/${input}`).then((dom) => {
        var _a, _b;
        const d = Q(dom);
        const word = text((_b = (_a = d.q(".word-area h1")) == null ? void 0 : _a.firstChild) == null ? void 0 : _b.textContent);
        const short = d.t(".word-area .short");
        const long = d.t(".word-area .long");
        const family = parsefamilys(d.q(".section.family"));
        const definitions = d.qa(".word-definitions ol li").map(definitionParser);
        const verba = {
          text: word,
          short,
          long,
          family,
          definitions
        };
        return verba;
      });
    };
    return search;
  }
  const _hoisted_1 = { class: "max-w-120 max-h-140 overflow-auto" };
  const _hoisted_2 = { class: "flex" };
  const _hoisted_3 = { class: "min-w-20 mr-2 text-right" };
  const _hoisted_4 = { class: "min-w-20 mr-2 text-right" };
  const _hoisted_5 = { class: "mb-1" };
  const _hoisted_6 = { key: 0 };
  const _hoisted_7 = /* @__PURE__ */ vue.createTextVNode("\u5355\u8BCD\u5BB6\u65CF");
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    props: {
      word: null
    },
    emits: ["update"],
    setup(__props, { emit: emits }) {
      const props = __props;
      const { word } = vue.toRefs(props);
      const verba = vue.ref(null);
      const search = useSearch();
      vue.watch(word, () => {
        search(word.value).then((result) => {
          verba.value = result;
          vue.nextTick(() => emits("update"));
        });
      }, { immediate: true });
      return (_ctx, _cache) => {
        const _component_n_tag = naiveUi.NTag;
        const _component_n_space = naiveUi.NSpace;
        const _component_n_text = naiveUi.NText;
        const _component_n_h3 = naiveUi.NH3;
        const _component_n_tooltip = naiveUi.NTooltip;
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          verba.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
            vue.createElementVNode("p", null, vue.toDisplayString(verba.value.short), 1),
            vue.createElementVNode("p", null, vue.toDisplayString(verba.value.long), 1),
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(verba.value.definitions, (def) => {
              return vue.openBlock(), vue.createElementBlock("div", {
                key: def.definition,
                class: "border my-2 p-2"
              }, [
                vue.createElementVNode("div", _hoisted_2, [
                  vue.createElementVNode("div", _hoisted_3, [
                    vue.createVNode(_component_n_tag, {
                      size: "small",
                      round: ""
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(def.classes), 1)
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  vue.createElementVNode("div", null, [
                    vue.createElementVNode("span", null, vue.toDisplayString(def.definition), 1),
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(def.examples, (example) => {
                      return vue.openBlock(), vue.createElementBlock("p", { key: example }, vue.toDisplayString(example), 1);
                    }), 128))
                  ])
                ]),
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(def.more, (ext) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    key: ext.detail,
                    class: "flex"
                  }, [
                    vue.createElementVNode("div", _hoisted_4, vue.toDisplayString(ext.detail), 1),
                    vue.createElementVNode("div", _hoisted_5, [
                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(ext.dds, (dd) => {
                        return vue.openBlock(), vue.createElementBlock("div", {
                          key: dd.definition
                        }, [
                          vue.createVNode(_component_n_space, { size: "small" }, {
                            default: vue.withCtx(() => [
                              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(dd.words, (w) => {
                                return vue.openBlock(), vue.createBlock(_component_n_tag, {
                                  key: w,
                                  size: "small"
                                }, {
                                  default: vue.withCtx(() => [
                                    vue.createTextVNode(vue.toDisplayString(w), 1)
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 128))
                            ]),
                            _: 2
                          }, 1024),
                          vue.createElementVNode("div", null, vue.toDisplayString(dd.definition), 1)
                        ]);
                      }), 128))
                    ])
                  ]);
                }), 128))
              ]);
            }), 128)),
            verba.value.family.length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, [
              vue.createVNode(_component_n_h3, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_n_text, null, {
                    default: vue.withCtx(() => [
                      _hoisted_7
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              vue.createVNode(_component_n_space, null, {
                default: vue.withCtx(() => [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(verba.value.family, (member) => {
                    return vue.openBlock(), vue.createBlock(_component_n_tooltip, {
                      key: member.word
                    }, {
                      trigger: vue.withCtx(() => [
                        vue.createVNode(_component_n_tag, null, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode(vue.toDisplayString(member.word) + "(" + vue.toDisplayString(member.pages) + ")", 1)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      default: vue.withCtx(() => [
                        vue.createTextVNode(" " + vue.toDisplayString(member.tips), 1)
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ]),
                _: 1
              })
            ])) : vue.createCommentVNode("", true)
          ], 64)) : vue.createCommentVNode("", true)
        ]);
      };
    }
  });
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    props: {
      pos: null,
      word: null,
      last: { type: Boolean }
    },
    emits: ["close"],
    setup(__props, { emit: emits }) {
      const updated = vue.ref(false);
      const popover = vue.ref();
      const update = () => {
        updated.value = true;
        popover.value.syncPosition();
      };
      return (_ctx, _cache) => {
        const _component_n_text = naiveUi.NText;
        const _component_n_h1 = naiveUi.NH1;
        const _component_n_popover = naiveUi.NPopover;
        return vue.openBlock(), vue.createBlock(_component_n_popover, {
          ref_key: "popover",
          ref: popover,
          placement: "right",
          show: !!__props.word,
          x: __props.pos.x,
          y: __props.pos.y,
          trigger: "manual"
        }, {
          header: vue.withCtx(() => [
            vue.createVNode(_component_n_h1, {
              style: { "margin": "0" },
              prefix: "bar"
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_n_text, { type: "primary" }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(__props.word), 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            __props.last && updated.value ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              "i-ion-close-round": "",
              class: "absolute right-2 top-2 text-xl cursor-pointer",
              onClick: _cache[0] || (_cache[0] = ($event) => emits("close"))
            })) : vue.createCommentVNode("", true)
          ]),
          default: vue.withCtx(() => [
            vue.createVNode(_sfc_main$2, {
              word: __props.word,
              onUpdate: update
            }, null, 8, ["word"])
          ]),
          _: 1
        }, 8, ["show", "x", "y"]);
      };
    }
  });
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const words = vue.ref([]);
      const pop = () => {
        words.value.pop();
      };
      useClickText((text2) => {
        if (!text2)
          pop();
        else
          words.value.push(text2);
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", null, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(words.value, (word, index) => {
            return vue.openBlock(), vue.createBlock(_sfc_main$1, {
              key: word.id,
              last: index === words.value.length - 1,
              word: word.text,
              pos: word.pos,
              onClose: pop
            }, null, 8, ["last", "word", "pos"]);
          }), 128))
        ]);
      };
    }
  });
  var main = /* @__PURE__ */ (() => "html,\nbody,\n#app {\n  height: 100%;\n  margin: 0;\n  padding: 0;\n}\n")();
  var __uno = /* @__PURE__ */ (() => "#--unocss--{layer:__ALL__}")();
  const container = (parent, cls = "") => {
    const appContainer = document.createElement("div");
    if (cls)
      appContainer.classList.add(cls);
    parent.insertBefore(appContainer, parent.firstChild);
    return appContainer;
  };
  const el = container(document.body, "tm-main-app");
  const app = vue.createApp(_sfc_main);
  app.mount(el);
})(Vue, naive, axios, axiosGmxhrAdapter);
