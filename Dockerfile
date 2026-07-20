FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /frontend

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

# When NEXT_PUBLIC_TINA_CLIENT_ID is set as a --build-arg, run build:cms (includes admin UI).
# Otherwise fall back to next build only.
ARG NEXT_PUBLIC_TINA_CLIENT_ID
ENV NEXT_PUBLIC_TINA_CLIENT_ID=$NEXT_PUBLIC_TINA_CLIENT_ID
ARG TINA_TOKEN
ENV TINA_TOKEN=$TINA_TOKEN

RUN if [ -n "$NEXT_PUBLIC_TINA_CLIENT_ID" ] && [ -n "$TINA_TOKEN" ]; then npm run build:cms; else npm run build; fi

CMD [ "npm", "start" ]
