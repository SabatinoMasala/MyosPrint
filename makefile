release-mac:
	rm -f build/*.dmg
	rm -f build/*.zip
	rm -f build/mac/*
	npm install
	npm run build-mac
	npm run sign
