release-mac:
	rm build/*.dmg
	rm build/*.zip
	rm build/mac/*
	npm install
	npm run build-mac
	npm run sign
