prod:
	firebase use default;

staging:
	firebase use staging;

deploy-hosting:
	cd web-grades; yarn build; cd ..; firebase deploy --only hosting;

deploy:
	cd web-grades; yarn build; cd ..; firebase deploy;

firebase-storage-bucket-cors:
	gsutil cors set cors.json gs://dev-grades-fd.appspot.com