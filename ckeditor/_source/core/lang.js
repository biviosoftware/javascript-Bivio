/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function()
{
	var loadedLangs = {};

	/**
	 * @namespace Holds language related functions.
	 */
	CKEDITOR.lang =
	{
		/**
		 * The list of languages available in the editor core.
		 * @type Object
		 * @example
		 * alert( CKEDITOR.lang.en );  // "true"
		 */
		languages :
		{
			'en'	: 1,
		},

		/**
		 * Loads a specific language file, or auto detect it. A callback is
		 * then called when the file gets loaded.
		 * @param {String} languageCode The code of the language file to be
		 *		loaded. If null or empty, autodetection will be performed. The
		 *		same happens if the language is not supported.
		 * @param {String} defaultLanguage The language to be used if
		 *		languageCode is not supported or if the autodetection fails.
		 * @param {Function} callback A function to be called once the
		 *		language file is loaded. Two parameters are passed to this
		 *		function: the language code and the loaded language entries.
		 * @example
		 */
		load : function( languageCode, defaultLanguage, callback )
		{
			// If no languageCode - fallback to browser or default.
			// If languageCode - fallback to no-localized version or default.
			if ( !languageCode || !CKEDITOR.lang.languages[ languageCode ] )
				languageCode = this.detect( defaultLanguage, languageCode );

			if ( !this[ languageCode ] )
			{
				CKEDITOR.scriptLoader.load( CKEDITOR.getUrl(
					'_source/' +	// @Packager.RemoveLine
					'lang/' + languageCode + '.js' ),
					function()
						{
							callback( languageCode, this[ languageCode ] );
						}
						, this );
			}
			else
				callback( languageCode, this[ languageCode ] );
		},

		/**
		 * Returns the language that best fit the user language. For example,
		 * suppose that the user language is "pt-br". If this language is
		 * supported by the editor, it is returned. Otherwise, if only "pt" is
		 * supported, it is returned instead. If none of the previous are
		 * supported, a default language is then returned.
		 * @param {String} defaultLanguage The default language to be returned
		 *		if the user language is not supported.
		 * @param {String} [probeLanguage] A language code to try to use,
		 *		instead of the browser based autodetection.
		 * @returns {String} The detected language code.
		 * @example
		 * alert( CKEDITOR.lang.detect( 'en' ) );  // e.g., in a German browser: "de"
		 */
		detect : function( defaultLanguage, probeLanguage )
		{
			var languages = this.languages;
			probeLanguage = probeLanguage || navigator.userLanguage || navigator.language;

			var parts = probeLanguage
					.toLowerCase()
					.match( /([a-z]+)(?:-([a-z]+))?/ ),
				lang = parts[1],
				locale = parts[2];

			if ( languages[ lang + '-' + locale ] )
				lang = lang + '-' + locale;
			else if ( !languages[ lang ] )
				lang = null;

			CKEDITOR.lang.detect = lang ?
				function() { return lang; } :
				function( defaultLanguage ) { return defaultLanguage; };

			return lang || defaultLanguage;
		}
	};

})();
