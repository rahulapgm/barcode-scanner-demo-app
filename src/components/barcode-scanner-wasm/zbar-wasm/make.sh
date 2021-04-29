
MODULE_NAME=scan
OUTPUT_JS=barcode-scanner.js
OUTPUT_WASM=barcode-scanner.wasm
emcc ${MODULE_NAME}.c \
	-o $OUTPUT_JS \
	-g1 \
	-s WASM=1 \
	-s MODULARIZE=1 \
	-s EXPORT_ES6=1 \
	-s 'EXPORT_NAME="$MODULE_NAME"' \
	-s EXPORTED_RUNTIME_METHODS=['ccall','cwrap','UTF8ToString'] \
    --js-library ./library.js \
    -I ~/ZBar/include ~/ZBar/zbar/libs/libzbar.a \
	-s 'ENVIRONMENT="web"'
# disable eslint
sed -i.old '1s;^;\/* eslint-disable *\/;' $OUTPUT_JS
sed -i.old "s|import.meta.url|'/${OUTPUT_WASM}'|" $OUTPUT_JS
sed -i.old "s|self.location.href|window.self.location.href|" $OUTPUT_JS
sed -i.old "s|var dataURIPrefix =|//var dataURIPrefix =|" $OUTPUT_JS
sed -i.old "s|function isDataURI|/\*\nfunction isDataURI|g" $OUTPUT_JS
sed -i.old "s|var fileURIPrefix|\*/\nvar fileURIPrefix|g" $OUTPUT_JS
sed -i.old "s|var wasmBinaryFile = '${OUTPUT_WASM}'|const wasmBinaryFile = '/${OUTPUT_WASM}'|" $OUTPUT_JS
sed -i.old "s|if (!isDataURI(wasmBinaryFile|/*\nif (!isDataURI(wasmBinaryFile|g" $OUTPUT_JS
sed -i.old "s|// Create the wasm instance|*/\n\n \\
const getBinaryPromise = () => new Promise((resolve, reject) => { \\
	fetch(wasmBinaryFile, { credentials: 'same-origin' }) \\
	.then( \\
		response => { \\
			if (!response['ok']) { \\
				throw \"failed to load wasm binary file at '\" + wasmBinaryFile + \"'\"; \\
			} \\
			return response['arrayBuffer'](); \\
		} \\
	) \\
	.then(resolve) \\
	.catch(reject); \\
}); \\
\n\n\/\/ Create the wasm instance|g" $OUTPUT_JS
sed -i.old "s|!isDataURI(wasmBinaryFile) |// !isDataURI(wasmBinaryFile) |g" $OUTPUT_JS

mv $OUTPUT_JS ../src/
mv $OUTPUT_WASM ../public/

# emcc -O3 -s WASM=1 \
# --js-library ./library.js \
# -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap", "UTF8ToString"]' \
# -I ~/ZBar/include ./scan.c ~/ZBar/zbar/libs/libzbar.a \
# > -s MODULARIZE=1 -o Sample.js