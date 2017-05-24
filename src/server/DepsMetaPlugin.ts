///<reference path="../node_modules/fuse-box/dist/typings/core/WorkflowContext.d.ts" />
///<reference path="../node_modules/fuse-box/dist/typings/core/File.d.ts" />

/**
 * @export
 * @class DepsGrabberPluginClass
 * @implements {Plugin}
 */
export class DepsMetaPluginClass implements Plugin {
    /**
     * @type {RegExp}
     * @memberOf DepsGrabberPluginClass
     */
    public test: RegExp = /\.(js|ts)x?$/;

    constructor() {
    }
		transform(file: File, ast) {
			file.meta.dependencies = file.analysis.dependencies;
		}
}

export const DepsMetaPlugin = () => {
    return new DepsMetaPluginClass();
};
