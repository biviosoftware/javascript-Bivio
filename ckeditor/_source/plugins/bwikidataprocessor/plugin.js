﻿//
// Bivio Wiki Language translation
//
// $Id$
//

function b2hFormat(line, marker, open, close)
{
    var result = '';
    var target = null;
       
    
    for (var i = 0; i < line.length; i++) {
	var c = line[i];
	var nxt = (i < line.length - 1) ? line[i + 1] : 0;
	    
	if (c == marker) {
	    if (target == null) {
		if ((i == 0) || (line[i - 1] == ' ') || (line[i - 1] == '\t')) {
		    target = "";
		} else {
		    result += c;
		}
            } else  {
	       if ((nxt == 0) || (nxt == '\t') || (nxt == ' ')) {
		   result += open + target + close;
		   target = null;
	       } else {
		   target += ' ';		   
	       }
	    }
	} else {
	    if (target == null) {
		result += c;
	    } else {
		target += c;
	    }	
	}
    }    	
    if (target != null) {
	result += target;
    }
    return result;
}

var empties = {
  "hr": true,
  "br": true
}

    

function b2hLine(ctx, line)
{
    line = b2hFormat(line, '*', "<strong>", "</strong>");    
    line = b2hFormat(line, '_', "<em>", "</em>");
        
    if (line.match(/^\s*@\S+/)) {
        directive = line.replace(/^\s*@/, "");
	var args = directive;
	directive = directive.replace(/^(\S+).*/, "$1");
	var dot = directive.indexOf(".");
	var clazz = "";
	
	args = args.substr(directive.length);
	
        if (dot > 0) {
            clazz = " class='" + directive.substr(dot + 1) + "' ";
	    directive = directive.substr(0, dot).toLowerCase();
	}

	var attrArray = args.match(/^\s*(\w+=[\"\'][^\"\']*[\"\']\s*)+/); 
	var attrs = attrArray == null ? '' : attrArray[0];
		
	args = args.substr(attrs.length);
	if (attrs.length) {
	    attrs = " " + attrs;
	}   
      	if (empties[directive]) {
	    ctx.html += "<" + directive + clazz + attrs + "/>";
	} else if (directive[0] == '/') {
	    ctx.html += "<" + directive + ">\n";
	} else {
	    ctx.html += "<" + directive + clazz + attrs + ">";
	    if (args.length) {		
		ctx.html += args + "</" + directive + ">";
	    }	    	    
	}
    } else {
	ctx.html += line + "";
    }
}
    
function b2h(bwiki)
{
    var ctx = {
	html: "",
    };

    var closed = 1;
    var implicit = 2;
    var explicit = 3;
   
    var state = closed;
    var depth = 0;
    
    bwiki = bwiki.replace(/\r/g, "");
    while (bwiki.length > 0) {
        var pos = bwiki.indexOf("\n"); 
	var line;
	if (pos < 0)  {
	    line = bwiki;
	    bwiki = "";
	}
	else {
	    line = bwiki.substr(0, pos);
	    bwiki = bwiki.substr(pos + 1);
	}
        if (line.replace(/^\s*|\s*$/g, "").length == 0) {
	    if (state == implicit) {
		b2hLine(ctx, "@/p");	    
		b2hLine(ctx, "@p");	    
	    }
	}
	else {
	    if (line[0] == "@") {
		if (state == implicit) {
		    b2hLine(ctx, "@/p");
		    state == closed;
		}
		if (line.match("^@[A-z0-9]+\s*$")) {
		    state = explicit;
		    depth++;		    
		}
		if (line.match("^@/[A-z0-9]\s*$")) {
		    depth--;
		    if (depth == 0) {
			state = closed;
		    }
		}
		b2hLine(ctx, line);
	    }
	    else {
		if (state == closed) {
		    b2hLine(ctx, "@p");	    
		    b2hLine(ctx, line);
		    state = implicit;
		}
		else {
		    b2hLine(ctx, line);
		}
	    }
	}
    }
    if (open) {
	b2hLine(ctx, "@/p");	    
    }
//    alert(ctx.html);
    return ctx.html;
}


var directives = {
  strike: "del"
};

    

function h2bElement(ctx)
{
    var sta = ++ctx.cur;

    // Get element name: <name...
    while ((ctx.cur < ctx.html.length) && (ctx.html[ctx.cur] != ' ')
	   && (ctx.html[ctx.cur] != '\t')
	   && (ctx.html[ctx.cur] != '/')
	   && (ctx.html[ctx.cur] != '>')) {
        ctx.cur++;	       
    }
    var name = ctx.html.substr(sta, ctx.cur - sta);
    var directive = directives[name] ? directives[name] : name;
    
    // Skip to end of tag
    while ((ctx.cur < ctx.html.length)
	   && (ctx.html.substr(ctx.cur, 2) != '/>')
	   && (ctx.html[ctx.cur] != '>')) {
	ctx.cur++;
    }

    // Get class and other attributes
    var attrs = "";
    var clazz = "";
    
    if (ctx.cur < ctx.html.length) {
	attrs = ctx.html.substr(sta + name.length, ctx.cur - sta - name.length);
	var carray = attrs.match(/class=[\'\"][^\'\"]*[\'\"]/);
	if (carray != null) {
	    clazz = "." + carray[0].substr(6).replace(/[\'\"]/g, "");	    
	    attrs = attrs.replace(carray[0], "");			
	}
    }
    
    if (ctx.html[ctx.cur] == '/') {
	// Closed element is an bwiki directive with no args
	ctx.cur += 2;
        ctx.bwiki += "\n@" + name + clazz + attrs;	
    } else {
	// Not closed - skip '>'
	if (ctx.cur < ctx.html.length) {
	    ctx.cur++;
	}    
	var content = "";
	var nrChildren = 0;
	var opened = false;
	while (ctx.cur < ctx.html.length) {
	    var sp = " ";
	    while ((ctx.cur < ctx.html.length) && (ctx.html[ctx.cur] != '<')) {
                var c;		
		if (ctx.html.substr(ctx.cur, 6) == "&nbsp;") {
		    ctx.cur += 6;
                    c = " ";
		} else {
		    c = ctx.html[ctx.cur++];
		}				
		if ((c == "\n") || (c == " ") || (c == "\t")) {
		    content += sp;
		    sp = "";		    
		} else {
		    content += c;
		    sp = " ";		    
		}		
	    }
    
	    if (ctx.html[ctx.cur + 1] != '/') {
		// Child
		if (!opened) {
		    ctx.bwiki += "\n@" + directive + clazz + attrs;
		    opened = true;
		}
		if (!content.match(/^\s*$/)) {
		    ctx.bwiki += "\n" + content;
		}
		content = "";
		nrChildren++;
		h2bElement(ctx);
	    } else {
		// End tag
		if (!content.match(/^\s*$/)) {
		    if (nrChildren == 0) {
			if ((directive == "p") && (clazz.length == 0) && (attrs.length == 0)) {
			    ctx.bwiki += "\n\n" + content;			
			}
			else {
			    ctx.bwiki += "\n@" + directive + clazz + attrs + " " + content; 
			}
		    } else {
			ctx.bwiki += "\n" + content;
		    }
		}
		break;
	    }
	}
	if (ctx.cur < ctx.html.length) {
	    // End tag - skip
	    ctx.cur += 2;
	    while ((ctx.cur < ctx.html.length) && (ctx.html[ctx.cur] != '>')) {
		ctx.cur++;
	    }
	    ctx.cur++;
	    if (nrChildren > 0) {
		ctx.bwiki += "\n@/" + directive;
	    }	    
	}	    
    }  
}

    

function h2b(html)
{
    var ctx = {
	bwiki: "",
	html: html.replace(/<!--.*?-->/g, ""),
	cur: 0,
    }
    while (ctx.cur < ctx.html.length) {
	while ((ctx.cur < ctx.html.length) && (ctx.html[ctx.cur] != '<')) {	    
	    ctx.cur++;
	}
	if (ctx.cur < ctx.html.length) {
	    h2bElement(ctx);	    
	}
    }
    ctx.bwiki = ctx.bwiki.replace(/^\s*|\s*$/g, "");
//    alert(ctx.bwiki);
    return ctx.bwiki;
}


/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function()
{
	// Regex to scan for &nbsp; at the end of blocks, which are actually placeholders.
	// Safari transforms the &nbsp; to \xa0. (#4172)
	var tailNbspRegex = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/;

	var protectedSourceMarker = '{cke_protected}';

	// Return the last non-space child node of the block (#4344).
	function lastNoneSpaceChild( block )
	{
		var lastIndex = block.children.length,
			last = block.children[ lastIndex - 1 ];
		while (  last && last.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim( last.value ) )
			last = block.children[ --lastIndex ];
		return last;
	}

	function trimFillers( block, fromSource )
	{
		// If the current node is a block, and if we're converting from source or
		// we're not in IE then search for and remove any tailing BR node.
		//
		// Also, any &nbsp; at the end of blocks are fillers, remove them as well.
		// (#2886)
		var children = block.children, lastChild = lastNoneSpaceChild( block );
		if ( lastChild )
		{
			if ( ( fromSource || !CKEDITOR.env.ie ) && lastChild.type == CKEDITOR.NODE_ELEMENT && lastChild.name == 'br' )
				children.pop();
			if ( lastChild.type == CKEDITOR.NODE_TEXT && tailNbspRegex.test( lastChild.value ) )
				children.pop();
		}
	}

	function blockNeedsExtension( block, fromSource, extendEmptyBlock )
	{
		if( !fromSource && ( !extendEmptyBlock ||
			typeof extendEmptyBlock == 'function' && ( extendEmptyBlock( block ) === false ) ) )
			return false;

        // 1. For IE version >=8,  empty blocks are displayed correctly themself in wysiwiyg;
        // 2. For the rest, at least table cell and list item need no filler space.
        // (#6248)
        if ( fromSource && CKEDITOR.env.ie &&
                ( document.documentMode > 7
                || block.name in CKEDITOR.dtd.tr
                || block.name in CKEDITOR.dtd.$listItem ) )
            return false;

		var lastChild = lastNoneSpaceChild( block );

		return !lastChild || lastChild &&
				( lastChild.type == CKEDITOR.NODE_ELEMENT && lastChild.name == 'br'
				// Some of the controls in form needs extension too,
				// to move cursor at the end of the form. (#4791)
				|| block.name == 'form' && lastChild.name == 'input' );
	}

	function getBlockExtension( isOutput, emptyBlockFiller )
	{
		return function( node )
		{
			trimFillers( node, !isOutput );

			if ( blockNeedsExtension( node, !isOutput, emptyBlockFiller ) )
			{
				if ( isOutput || CKEDITOR.env.ie )
					node.add( new CKEDITOR.htmlParser.text( '\xa0' ) );
				else
					node.add( new CKEDITOR.htmlParser.element( 'br', {} ) );
			}
		};
	}

	var dtd = CKEDITOR.dtd;

	// Find out the list of block-like tags that can contain <br>.
	var blockLikeTags = CKEDITOR.tools.extend( {}, dtd.$block, dtd.$listItem, dtd.$tableContent );
	for ( var i in blockLikeTags )
	{
		if ( ! ( 'br' in dtd[i] ) )
			delete blockLikeTags[i];
	}
	// We just avoid filler in <pre> right now.
	// TODO: Support filler for <pre>, line break is also occupy line height.
	delete blockLikeTags.pre;
	var defaultDataFilterRules =
	{
		elements : {
			a : function( element )
			{
				var attrs = element.attributes;
				if ( attrs && attrs[ 'data-cke-saved-name' ] )
					attrs[ 'class' ] = ( attrs[ 'class' ] ? attrs[ 'class' ] + ' ' : '' ) + 'cke_anchor';
			}
		},
		attributeNames :
		[
			// Event attributes (onXYZ) must not be directly set. They can become
			// active in the editing area (IE|WebKit).
			[ ( /^on/ ), 'data-cke-pa-on' ]
		]
	};

	var defaultDataBlockFilterRules = { elements : {} };

	for ( i in blockLikeTags )
		defaultDataBlockFilterRules.elements[ i ] = getBlockExtension();

	var defaultHtmlFilterRules =
		{
			elementNames :
			[
				// Remove the "cke:" namespace prefix.
				[ ( /^cke:/ ), '' ],

				// Ignore <?xml:namespace> tags.
				[ ( /^\?xml:namespace$/ ), '' ]
			],

			attributeNames :
			[
				// Attributes saved for changes and protected attributes.
				[ ( /^data-cke-(saved|pa)-/ ), '' ],

				// All "data-cke-" attributes are to be ignored.
				[ ( /^data-cke-.*/ ), '' ],

				[ 'hidefocus', '' ]
			],

			elements :
			{
				$ : function( element )
				{
					var attribs = element.attributes;

					if ( attribs )
					{
						// Elements marked as temporary are to be ignored.
						if ( attribs[ 'data-cke-temp' ] )
							return false;

						// Remove duplicated attributes - #3789.
						var attributeNames = [ 'name', 'href', 'src' ],
							savedAttributeName;
						for ( var i = 0 ; i < attributeNames.length ; i++ )
						{
							savedAttributeName = 'data-cke-saved-' + attributeNames[ i ];
							savedAttributeName in attribs && ( delete attribs[ attributeNames[ i ] ] );
						}
					}

					return element;
				},

				embed : function( element )
				{
					var parent = element.parent;

					// If the <embed> is child of a <object>, copy the width
					// and height attributes from it.
					if ( parent && parent.name == 'object' )
					{
						var parentWidth = parent.attributes.width,
							parentHeight = parent.attributes.height;
						parentWidth && ( element.attributes.width = parentWidth );
						parentHeight && ( element.attributes.height = parentHeight );
					}
				},
				// Restore param elements into self-closing.
				param : function( param )
				{
					param.children = [];
					param.isEmpty = true;
					return param;
				},

				// Remove empty link but not empty anchor.(#3829)
				a : function( element )
				{
					if ( !( element.children.length ||
							element.attributes.name ||
							element.attributes[ 'data-cke-saved-name' ] ) )
					{
						return false;
					}
				},

				// Remove dummy span in webkit.
				span: function( element )
				{
					if ( element.attributes[ 'class' ] == 'Apple-style-span' )
						delete element.name;
				},

				// Empty <pre> in IE is reported with filler node (&nbsp;).
				pre : function( element ) { CKEDITOR.env.ie && trimFillers( element ); },

				html : function( element )
				{
					delete element.attributes.contenteditable;
					delete element.attributes[ 'class' ];
				},

				body : function( element )
				{
					delete element.attributes.spellcheck;
					delete element.attributes.contenteditable;
				},

				style : function( element )
				{
					var child = element.children[ 0 ];
					child && child.value && ( child.value = CKEDITOR.tools.trim( child.value ));

					if ( !element.attributes.type )
						element.attributes.type = 'text/css';
				},

				title : function( element )
				{
					var titleText = element.children[ 0 ];
					titleText && ( titleText.value = element.attributes[ 'data-cke-title' ] || '' );
				}
			},

			attributes :
			{
				'class' : function( value, element )
				{
					// Remove all class names starting with "cke_".
					return CKEDITOR.tools.ltrim( value.replace( /(?:^|\s+)cke_[^\s]*/g, '' ) ) || false;
				}
			},

			comment : function( contents )
			{
				// If this is a comment for protected source.
				if ( contents.substr( 0, protectedSourceMarker.length ) == protectedSourceMarker )
				{
					// Remove the extra marker for real comments from it.
					if ( contents.substr( protectedSourceMarker.length, 3 ) == '{C}' )
						contents = contents.substr( protectedSourceMarker.length + 3 );
					else
						contents = contents.substr( protectedSourceMarker.length );

					return new CKEDITOR.htmlParser.cdata( decodeURIComponent( contents ) );
				}

				return contents;
			}
		};

	if ( CKEDITOR.env.ie )
	{
		// IE outputs style attribute in capital letters. We should convert
		// them back to lower case, while not hurting the values (#5930)
		defaultHtmlFilterRules.attributes.style = function( value, element )
		{
			return value.replace( /(^|;)([^\:]+)/g, function( match )
				{
					return match.toLowerCase();
				});
		};
	}

	function protectReadOnly( element )
	{
		var attrs = element.attributes;

		// We should flag that the element was locked by our code so
		// it'll be editable by the editor functions (#6046).
		if ( attrs.contenteditable != "false" )
			attrs[ 'data-cke-editable' ] = attrs.contenteditable ? 'true' : 1;

		attrs.contenteditable = "false";
	}
	function unprotectReadyOnly( element )
	{
		var attrs = element.attributes;
		switch( attrs[ 'data-cke-editable' ] )
		{
			case 'true':	attrs.contenteditable = 'true';	break;
			case '1':		delete attrs.contenteditable;	break;
		}
	}
	// Disable form elements editing mode provided by some browers. (#5746)
	for ( i in { input : 1, textarea : 1 } )
	{
		defaultDataFilterRules.elements[ i ] = protectReadOnly;
		defaultHtmlFilterRules.elements[ i ] = unprotectReadyOnly;
	}

	var protectElementRegex = /<(a|area|img|input)\b([^>]*)>/gi,
		protectAttributeRegex = /\b(href|src|name)\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|(?:[^ "'>]+))/gi;

	var protectElementsRegex = /(?:<style(?=[ >])[^>]*>[\s\S]*<\/style>)|(?:<(:?link|meta|base)[^>]*>)/gi,
		encodedElementsRegex = /<cke:encoded>([^<]*)<\/cke:encoded>/gi;

	var protectElementNamesRegex = /(<\/?)((?:object|embed|param|html|body|head|title)[^>]*>)/gi,
		unprotectElementNamesRegex = /(<\/?)cke:((?:html|body|head|title)[^>]*>)/gi;

	var protectSelfClosingRegex = /<cke:(param|embed)([^>]*?)\/?>(?!\s*<\/cke:\1)/gi;

	function protectAttributes( html )
	{
		return html.replace( protectElementRegex, function( element, tag, attributes )
		{
			return '<' +  tag + attributes.replace( protectAttributeRegex, function( fullAttr, attrName )
			{
				// We should not rewrite the existed protected attributes, e.g. clipboard content from editor. (#5218)
				if ( attributes.indexOf( 'data-cke-saved-' + attrName ) == -1 )
					return ' data-cke-saved-' + fullAttr + ' ' + fullAttr;

				return fullAttr;
			}) + '>';
		});
	}

	function protectElements( html )
	{
		return html.replace( protectElementsRegex, function( match )
			{
				return '<cke:encoded>' + encodeURIComponent( match ) + '</cke:encoded>';
			});
	}

	function unprotectElements( html )
	{
		return html.replace( encodedElementsRegex, function( match, encoded )
			{
				return decodeURIComponent( encoded );
			});
	}

	function protectElementsNames( html )
	{
		return html.replace( protectElementNamesRegex, '$1cke:$2');
	}

	function unprotectElementNames( html )
	{
		return html.replace( unprotectElementNamesRegex, '$1$2' );
	}

	function protectSelfClosingElements( html )
	{
		return html.replace( protectSelfClosingRegex, '<cke:$1$2></cke:$1>' );
	}

	function protectPreFormatted( html )
	{
		return html.replace( /(<pre\b[^>]*>)(\r\n|\n)/g, '$1$2$2' );
	}

	function protectRealComments( html )
	{
		return html.replace( /<!--(?!{cke_protected})[\s\S]+?-->/g, function( match )
			{
				return '<!--' + protectedSourceMarker +
						'{C}' +
						encodeURIComponent( match ).replace( /--/g, '%2D%2D' ) +
						'-->';
			});
	}

	function unprotectRealComments( html )
	{
		return html.replace( /<!--\{cke_protected\}\{C\}([\s\S]+?)-->/g, function( match, data )
			{
				return decodeURIComponent( data );
			});
	}

	function protectSource( data, protectRegexes )
	{
		var protectedHtml = [],
			tempRegex = /<\!--\{cke_temp(comment)?\}(\d*?)-->/g;

		var regexes =
			[
				// Script tags will also be forced to be protected, otherwise
				// IE will execute them.
				( /<script[\s\S]*?<\/script>/gi ),

				// <noscript> tags (get lost in IE and messed up in FF).
				/<noscript[\s\S]*?<\/noscript>/gi
			]
			.concat( protectRegexes );

		// First of any other protection, we must protect all comments
		// to avoid loosing them (of course, IE related).
		// Note that we use a different tag for comments, as we need to
		// transform them when applying filters.
		data = data.replace( (/<!--[\s\S]*?-->/g), function( match )
			{
				return  '<!--{cke_tempcomment}' + ( protectedHtml.push( match ) - 1 ) + '-->';
			});

		for ( var i = 0 ; i < regexes.length ; i++ )
		{
			data = data.replace( regexes[i], function( match )
				{
					match = match.replace( tempRegex, 		// There could be protected source inside another one. (#3869).
						function( $, isComment, id )
						{
							return protectedHtml[ id ];
						}
					);
					return  '<!--{cke_temp}' + ( protectedHtml.push( match ) - 1 ) + '-->';
				});
		}
		data = data.replace( tempRegex,	function( $, isComment, id )
			{
				return '<!--' + protectedSourceMarker +
						( isComment ? '{C}' : '' ) +
						encodeURIComponent( protectedHtml[ id ] ).replace( /--/g, '%2D%2D' ) +
						'-->';
			}
		);
		return data;
	}

	CKEDITOR.plugins.add( 'bwikidataprocessor',
	{
		requires : [ 'htmlwriter' ],

		init : function( editor )
		{
			var dataProcessor = editor.dataProcessor = new CKEDITOR.htmlDataProcessor( editor );

			dataProcessor.writer.forceSimpleAmpersand = editor.config.forceSimpleAmpersand;

			dataProcessor.dataFilter.addRules( defaultDataFilterRules );
			dataProcessor.dataFilter.addRules( defaultDataBlockFilterRules );
			dataProcessor.htmlFilter.addRules( defaultHtmlFilterRules );

			var defaultHtmlBlockFilterRules = { elements : {} };
			for ( i in blockLikeTags )
				defaultHtmlBlockFilterRules.elements[ i ] = getBlockExtension( true, editor.config.fillEmptyBlocks );

			dataProcessor.htmlFilter.addRules( defaultHtmlBlockFilterRules );
		},

		onLoad : function()
		{
			! ( 'fillEmptyBlocks' in CKEDITOR.config ) && ( CKEDITOR.config.fillEmptyBlocks = 1 );
		}
	});

	CKEDITOR.htmlDataProcessor = function( editor )
	{
		this.editor = editor;

		this.writer = new CKEDITOR.htmlWriter();
		this.dataFilter = new CKEDITOR.htmlParser.filter();
		this.htmlFilter = new CKEDITOR.htmlParser.filter();
	};

	CKEDITOR.htmlDataProcessor.prototype =
	{
		toHtml : function( data, fixForBody )
		{
                        //alert(data);
                        data = b2h(data);
                        //alert(data);
                        //return data;
			// The source data is already HTML, but we need to clean
			// it up and apply the filter.

			data = protectSource( data, this.editor.config.protectedSource );

			// Before anything, we must protect the URL attributes as the
			// browser may changing them when setting the innerHTML later in
			// the code.
			data = protectAttributes( data );

			// Protect elements than can't be set inside a DIV. E.g. IE removes
			// style tags from innerHTML. (#3710)
			data = protectElements( data );

			// Certain elements has problem to go through DOM operation, protect
			// them by prefixing 'cke' namespace. (#3591)
			data = protectElementsNames( data );

			// All none-IE browsers ignore self-closed custom elements,
			// protecting them into open-close. (#3591)
			data = protectSelfClosingElements( data );

			// Compensate one leading line break after <pre> open as browsers
			// eat it up. (#5789)
			data = protectPreFormatted( data );

			// Call the browser to help us fixing a possibly invalid HTML
			// structure.
			var div = new CKEDITOR.dom.element( 'div' );
			// Add fake character to workaround IE comments bug. (#3801)
			div.setHtml( 'a' + data );
			data = div.getHtml().substr( 1 );

			// Unprotect "some" of the protected elements at this point.
			data = unprotectElementNames( data );

			data = unprotectElements( data );

			// Restore the comments that have been protected, in this way they
			// can be properly filtered.
			data = unprotectRealComments( data );

			// Now use our parser to make further fixes to the structure, as
			// well as apply the filter.
			var fragment = CKEDITOR.htmlParser.fragment.fromHtml( data, fixForBody ),
				writer = new CKEDITOR.htmlParser.basicWriter();

			fragment.writeHtml( writer, this.dataFilter );
			data = writer.getHtml( true );

			// Protect the real comments again.
			data = protectRealComments( data );
			//alert(data);
			return data;
 	        },

		toDataFormat : function( html, fixForBody )
		{
			var writer = this.writer,
				fragment = CKEDITOR.htmlParser.fragment.fromHtml( html, fixForBody );

			writer.reset();

			fragment.writeHtml( writer, this.htmlFilter );
			var html = writer.getHtml(true);
                        var bwiki = h2b(html);
                        //alert(html);
                        //alert(bwiki);
			return bwiki;
		}
	};
})();

/**
 * Whether to force using "&" instead of "&amp;amp;" in elements attributes
 * values, it's not recommended to change this setting for compliance with the
 * W3C XHTML 1.0 standards (<a href="http://www.w3.org/TR/xhtml1/#C_12">C.12, XHTML 1.0</a>).
 * @name CKEDITOR.config.forceSimpleAmpersand
 * @name CKEDITOR.config.forceSimpleAmpersand
 * @type Boolean
 * @default false
 * @example
 * config.forceSimpleAmpersand = false;
 */

/**
 * Whether a filler text (non-breaking space entity - &nbsp;) will be inserted into empty block elements in HTML output,
 * this is used to render block elements properly with line-height; When a function is instead specified,
 * it'll be passed a {@link CKEDITOR.htmlParser.element} to decide whether adding the filler text
 * by expecting a boolean return value.
 * @name CKEDITOR.config.fillEmptyBlocks
 * @since 3.5
 * @type Boolean
 * @default true
 * @example
 * config.fillEmptyBlocks = false;	// Prevent filler nodes in all empty blocks.
 *
 * // Prevent filler node only in float cleaners.
 * config.fillEmptyBlocks = function( element )
 * {
 * 	if ( element.attributes[ 'class' ].indexOf ( 'clear-both' ) != -1 )
 * 		return false;
 * }
 */
