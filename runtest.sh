set -e
tsc --target es2021 --strict *.ts
cat contentscript.js contentscript_test.js | grep -v "^import 'jasmine';$" > contentscript_test_bundled.js
npx karma run
