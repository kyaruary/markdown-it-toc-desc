"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function findHeadings(tokens, option) {
    var _a;
    var headings = [];
    var size = tokens.length;
    var slugify = typeof option.slugify === "function" ? option.slugify : function (s) { return s; };
    var index = 0;
    while (index < size) {
        var token = tokens[index];
        var level = (_a = +token.tag.substr(1, 1)) !== null && _a !== void 0 ? _a : -1;
        if (token.type === "heading_open" && option.includeLevel.indexOf(level) !== -1) {
            var content = tokens[index + 1].content;
            var h = {
                level: level,
                content: content,
                parent: null,
                children: [],
                link: "#" + slugify(content),
            };
            headings.push(h);
            index += 3;
        }
        else {
            index++;
        }
    }
    return headings;
}
function flat2Tree(headings) {
    var current = null;
    var root = [];
    for (var i = 0; i < headings.length; i++) {
        var h = headings[i];
        if (h.level === 1) {
            root.push(h);
            current = null;
        }
        if (current === null) {
            current = h;
        }
        else {
            while (h.level !== current.level + 1) {
                if (h.level > current.level && current.children.length !== 0) {
                    current = current.children[current.children.length - 1];
                }
                else if (h.level <= current.level && current.parent !== null) {
                    current = current.parent;
                }
                else {
                    break;
                }
            }
            if (h.level === current.level + 1) {
                h.parent = current;
                current.children.push(h);
                current = h;
            }
        }
    }
    return root;
}
function removeUselessProperties(hsd) {
    for (var i = 0; i < hsd.length; i++) {
        delete hsd[i].parent;
        delete hsd[i].level;
        removeUselessProperties(hsd[i].children);
    }
}
function MarkdownItTocDesc(md, o) {
    md.core.ruler.push("toc_desc", function (state) {
        var _a;
        var headings = findHeadings(state.tokens, o);
        var tree = flat2Tree(headings);
        removeUselessProperties(tree);
        (_a = o === null || o === void 0 ? void 0 : o.getTocTree) === null || _a === void 0 ? void 0 : _a.call(o, tree);
        return true;
    });
}
exports.default = MarkdownItTocDesc;
