
const fs   = require('fs'),
      es   = require('event-stream'),

      hljs = require('highlight.js'),
      mdm  = require('meta-marked');
//      rnd  = mdm._marked.Renderer();

const highlight = (code, lang) => `<div class="hljs">${hljs.highlight(lang, code).value.trim()}</div>`;
/*
rnd.heading = function (text, level) {
  var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

  return '<h' + level + '><a name="' +
                escapedText +
                 '" class="anchor" href="#' +
                 escapedText +
                 '"><span class="header-link"></span></a>' +
                  text + '</h' + level + '>';
};
*/
mdm.setOptions({ highlight: highlight/*, renderer: rnd*/ });




const template_defaults = require('./config/template_defaults.json');





function gulp_factory(template) {

    "use strict";

    return es.map( function (file, callback) {

        file.contents = new Buffer( page_factory(template || '', `${file.contents}`) );

        callback(null, file);

    } );

}





function page_factory(template, content, provided_defaults) {

    var args = mdm(content.trim()),
        defs = Object.assign({}, template_defaults, (provided_defaults || {}) );

    return apply_template(template, args.html, args.meta, defs);

}





function apply_template(template, content, args, defaults) {

    var current = template,
        vals    = Object.assign({}, defaults, args, {'page body content': content}),
        keys    = Object.keys(vals);

    keys.map(k => current = current.split(`<!-- {{${k}}} -->`).join(vals[k]) );

    return current;

}





module.exports = { apply_template, page_factory, gulp_factory };
