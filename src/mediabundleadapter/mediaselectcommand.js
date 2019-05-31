/**
 * @license Copyright (c) 2018, Inventis. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
// import { findOptimalInsertionPosition } from '@ckeditor/ckeditor5-widget/src/utils';
/**
 * @module inventis/mediaselectcommand
 */

/**
 * Image upload command.
 *
 * @extends module:core/command~Command
 */
export default class MediaSelectCommand extends Command {


	/**
	 * Executes the command.
	 *
	 * @fires execute
	 * @param {Object} options Options for the executed command.
	 *      @param {HTMLElement} options.element The image file or an array of image files to upload.
	 */
	execute( options ) {
		const selectMediaEvent = new CustomEvent('selectMedia', {bubbles: true});
		options.element.dispatchEvent(selectMediaEvent);
	}
}
