prod:
	firebase use default;

staging:
	firebase use staging;

deploy-hosting:
	cd web-grades; yarn build; cd ..; firebase deploy --only hosting;

deploy:
	cd web-grades; yarn build; cd ..; firebase deploy;