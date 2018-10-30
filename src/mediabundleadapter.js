/**
 * @license Copyright (c) 2018, Inventis. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module inventis/mediabundleadapter
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import MediaSelect from './mediabundleadapter/mediaselect';
import MediaSelectCommand from './mediabundleadapter/mediaselectcommand';
import MediaInsertCommand from './mediabundleadapter/mediainsertcommand';

/**
 * A plugin that allows external implementations to handle media selection and insertion
 * @extends module:core/plugin~Plugin
 */
export default class MediaBundleAdapter extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'MediaBundleAdapter';
	}

	init() {
        // Register mediaSelect command.
        this.editor.commands.add( 'mediaSelect', new MediaSelectCommand( this.editor ) );
        this.editor.commands.add( 'mediaInsert', new MediaInsertCommand( this.editor ) );
    }

	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ MediaSelect ];
	}
}
