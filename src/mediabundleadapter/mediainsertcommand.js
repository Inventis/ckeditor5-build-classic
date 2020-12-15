/**
 * @license Copyright (c) 2013-2018, CKSource, 2018 Inventis. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import {findOptimalInsertionPosition} from '@ckeditor/ckeditor5-widget/src/utils';

/**
 * @module inventis/mediainsertcommand
 */

/**
 * Image upload command.
 *
 * @extends module:core/command~Command
 */
export default class MediaInsertCommand extends Command {
    /**
     * @inheritDoc
     */
    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const schema = model.schema;

        this.isEnabled = isImageAllowedInParent( selection, schema, model ) && checkSelectionWithObject( selection, schema );
    }

    /**
     * Executes the command.
     *
     * @fires execute
     * @param {Object} options Options for the executed command.
     * @param {File|Array.<File>} options.files The image file or an array of image files to upload.
     */
    execute(options) {
        const editor = this.editor;

        editor.model.change(writer => {
            const mediaToInsert = Array.isArray(options.media) ? options.media : [options.media];

            for (const file of mediaToInsert) {
                insertMedia(writer, editor, file);
            }
        });
    }
}

// Handles uploading single file.
//
// @param {module:engine/model/writer~writer} writer
// @param {module:core/editor/editor~Editor} editor
// @param {File} file
function insertMedia(writer, editor, media)
{
    const doc = editor.model.document;

    let imageAttributes = {src: media.src, alt: media.name, caption: media.description};
    const srcSet = media.srcset && Array.isArray(media.srcset) ? media.srcset.join(',') : null;
    if (srcSet) {
        imageAttributes.srcset = srcSet;
    }
    const image = writer.createElement('image', imageAttributes);
    const caption = writer.createElement('caption');
    if (media.description) {
        writer.insert(writer.createText(media.description), caption);
    }
    writer.append(caption, image);

    const insertAtSelection = findOptimalInsertionPosition(doc.selection, editor.model);

    editor.model.insertContent(image, insertAtSelection);

    // Inserting an image might've failed due to schema regulations.
    if (image.parent) {
        writer.setSelection(image, 'on');
    }
}

// Checks if image is allowed by schema in optimal insertion parent.
function isImageAllowedInParent( selection, schema, model )
{
    const parent = getInsertImageParent( selection, model );

    if (!parent) {
    	return true;
	}

    return schema.checkChild( parent, 'image' );
}

// Additional check for when the command should be disabled:
// - selection is on object
// - selection is inside object
function checkSelectionWithObject( selection, schema )
{
    const selectedElement = selection.getSelectedElement();

    const isSelectionOnObject = !!selectedElement && schema.isObject( selectedElement );
    const isSelectionInObject = !![ ...selection.focus.getAncestors() ].find( ancestor => schema.isObject( ancestor ) );

    return !isSelectionOnObject && !isSelectionInObject;
}

// Returns a node that will be used to insert image with `model.insertContent` to check if image can be placed there.
function getInsertImageParent( selection, model )
{
    const insertAt = findOptimalInsertionPosition( selection, model );

    let parent = insertAt.parent;

    if ( !parent.is( '$root' ) ) {
        parent = parent.parent;
    }

    return parent;
}
