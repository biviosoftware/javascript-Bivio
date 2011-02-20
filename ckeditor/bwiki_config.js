/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.editorConfig = function( config )
{
	// Define changes to default configuration here. For example:
//	config.language = 'fr';
//	config.uiColor = '#AADC6E';
	config.toolbar_Full =
[
    ['Source','-'],
    ['Save',, '-'],
    ['Cut','Copy','Paste','PasteText','PasteFromWord','-'],
    ['Undo','Redo','-',
     'Find','Replace','-',
     'SelectAll','RemoveFormat', '-',
     'Maximize', 'ShowBlocks'],
    ['Link','Unlink','Anchor'],
    '/',
    ['Bold','Italic','Underline','Strike'],
    ['TextColor','BGColor'],
    ['Subscript','Superscript'],
    ['NumberedList','BulletedList','-','Outdent','Indent','Blockquote','CreateDiv'],
    ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
    '/',
    ['Styles','Format','Font','FontSize'],
    ['Image','Table','HorizontalRule','Smiley','SpecialChar','PageBreak']
];
};
