/**
 * @license Copyright (c) 2018, Inventis. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import { findOptimalInsertionPosition } from '@ckeditor/ckeditor5-widget/src/utils';

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

// Checks if image is allowed by schema in optimal insertion parent.
function isImageAllowedInParent( selection, schema ) {
	const parent = getInsertImageParent( selection );

	return schema.checkChild( parent, 'image' );
}

// Additional check for when the command should be disabled:
// - selection is on object
// - selection is inside object
function checkSelectionWithObject( selection, schema ) {
	const selectedElement = selection.getSelectedElement();

	const isSelectionOnObject = !!selectedElement && schema.isObject( selectedElement );
	const isSelectionInObject = !![ ...selection.focus.getAncestors() ].find( ancestor => schema.isObject( ancestor ) );

	return !isSelectionOnObject && !isSelectionInObject;
}

// Returns a node that will be used to insert image with `model.insertContent` to check if image can be placed there.
function getInsertImageParent( selection ) {
	const insertAt = findOptimalInsertionPosition( selection );

	let parent = insertAt.parent;

	if ( !parent.is( '$root' ) ) {
		parent = parent.parent;
	}

	return parent;
}
