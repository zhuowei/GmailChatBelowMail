set -e
tsc --target es2021 --strict *.ts
cat terrible_test_header.js contentscript.js contentscript_test.js | grep -v "^import 'jasmine';$" > contentscript_test_bundled.js
bash testme.sh
