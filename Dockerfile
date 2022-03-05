FROM node:latest
ENV BOSH_URL='' \
    SERVICE_WORKER=false \
    SECURE_HOSTNAME=localhost \
    ENVIRONMENT_SECURITY_MODE=strict
WORKDIR /srv
COPY ./ /srv
RUN yarn upgrade && \
    yarn install && \
	yarn build && \
    npx browserslist@latest --update-db
ENTRYPOINT yarn start
