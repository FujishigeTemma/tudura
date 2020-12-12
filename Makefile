f=Hello
REGION=asia-northeast1
CONNECTOR_NAME=tudura

PHONY: deploy
deploy:
	@gcloud functions deploy ${f} --region ${REGION} --vpc-connector ${CONNECTOR_NAME} --runtime go113 --trigger-http --allow-unauthenticated

PHONY: delete
delete:
	@gcloud functions delete ${f}
