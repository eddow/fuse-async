declare var FuseBox: 
export type LazyConfig = {
	lazyLoadPackage?: (name: string)=> Promise<any>
	lazyLoadFile?: (RefOpts: {path?: string, pkg?: string, v?: string})=> Promise<any>
}
function $getDir(filePath: string) {
    return filePath.substring(0, filePath.lastIndexOf("/")) || "./";
};
export class Lazy {
	lazyLoadPackage: (name: string)=> Promise<any> = null
	lazyLoadFile: (RefOpts: {path?: string, pkg?: string, v?: string})=> Promise<any> = null
	constructor(config: LazyConfig) {
		__assign(this, config);
	}
	load(name: string, o: any = {}): Promise<any> {
		var promise: Promise<any> = Promise.resolve(true), pkg = o.pkg;
		if(46!== name.charCodeAt(0)) {	// '.'
			pkg = name.split('/', 2)[0];
			if(!FuseBox.packages[pkg])
				promise = this.lazyLoadPackage(pkg);
		}
		return promise.then(()=> {
			function getInfo() {
				return FuseBox.import(name, __assign({}, o, {meta: true}));
			}
			var info = getInfo();
			return info.file ?
				Promise.resolve(info) :
				this.lazyLoadFile(info.ref).then(getInfo);
		}).then(({ref, file})=> {
			if (file.locals && file.locals.module) return Promise.resolve(file.locals.module.exports);
			var promises = [], {dependencies} = file.meta;
			for(let dependency of dependencies)
				promises.push(this.load(dependency, {
					pkg,
					path: $getDir(ref.validPath),
					v: ref.versions
				}));
			return Promise.all(promises).then(()=> FuseBox.import(name, o));
		});

	}
}