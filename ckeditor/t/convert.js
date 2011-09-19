// $Id$
// bwiki <==> html converter for ckeditor unit tests

var plugin = readFile("_source/plugins/bwikidataprocessor/plugin.js");

//
// Dummy definitions to allow the plugin to be
// evaluated in this environment
// 

var window = new Object();
var document = {
  unit_test: true,
  location: {
      pathname: '/site/',
  }
  
};
var CKEDITOR = new Object();
CKEDITOR.tools = new Object();
CKEDITOR.tools.extend = function() {
    return '';
}
CKEDITOR.dtd = new Object();
CKEDITOR.dtd.$block = '';
CKEDITOR.env = new Object();
CKEDITOR.env.ie = 0;
CKEDITOR.plugins = new Object();
CKEDITOR.plugins.add = function() {
    return '';
}

function alert()
{
}

eval(plugin);

var command = arguments[0];
var filename = arguments[1];

if (!filename || !command.match(/^(-tobwiki|-tohtml)$/)) {
    print("Usage: {-tobwiki} <input-file>\n" +
	  "       {-tohtml }\n");
    quit();
}
var input = readFile(filename);
if (command == "-tohtml") {
    print(CKEDITOR.b2h(input) + '\n');
}
else {
    print(CKEDITOR.h2b(input) + '\n');
}


