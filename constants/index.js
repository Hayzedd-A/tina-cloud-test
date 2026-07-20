// First-order discount — change these values as needed
export const FIRST_ORDER_COUPON_CODE = "WELCOME10";
export const FIRST_ORDER_DISCOUNT_PERCENT = 10;

// dev
// export const STORE_ID="ba629b0f-9749-4097-bfc7-825fdcfe6811";

// prod

const NO_DISCOUNT_DELIVERY_DATE = "2026-02-14"; // val day

export const isNoDiscountDate = (ts) =>
  new Date(ts).toDateString() ===
  new Date(NO_DISCOUNT_DELIVERY_DATE).toDateString();

export const STORE_ID = "8a7a28dc-b54d-4841-b949-efe60dbae709";
export const merchentRef = "ref_8d6cd1583f4ee33c29786a208d";

export const CHOWDECK_KEY =
  "sk_test_7869ea89f1b52e7b48b0606afeaa1f9e74755f1fb83c5b8106";
export const API_BASE_URL = "https://api.zupa.ng/";
// export const API_BASE_URL = "https://dev.api.zupa.ng/";
// export const API_BASE_URL = "http://localhost:3000/";
export const CHOWDECK_API_URL = `https://api.chowdeck.com/merchant/${merchentRef}`;
// export const ANALYTICS_API_BASE_URL = 'http://localhost:3000/'
export const ANALYTICS_API_BASE_URL = API_BASE_URL;
// export const paystack_env = "dev";
export const paystack_env = "prod";
export const FREE_DELIVERY_TRESHOLD = 25000;
export const DELIVERY_DISCOUNT = isNoDiscountDate(Date.now()) ? 0 : 3000;

export const KITCHEN_LOCATION = {
  latitude: "6.601838",
  longitude: "3.3514863",
};

// export const API_BASE_URL = "http://localhost:3000/";
// export const paystack_env = "dev";
Jul 20 11:08:44  [34m╭────────────[34m[30m[44m dockerfile build [0m[0m[34m───────────╼[0m
Jul 20 11:08:44  [34m│[0m [34m › using dockerfile [35m/.app_platform_workspace/Dockerfile[0m[0m
Jul 20 11:08:44  [34m│[0m [34m › using build context [35m/.app_platform_workspace//[0m[0m
Jul 20 11:08:44  [34m│[0m 
Jul 20 11:08:44  [34m│[0m [36mINFO[0m[0000] Using dockerignore file: /.app_platform_workspace/.dockerignore 
Jul 20 11:08:44  [34m│[0m [36mINFO[0m[0000] Retrieving image manifest node:16-alpine     
Jul 20 11:08:44  [34m│[0m [36mINFO[0m[0000] Retrieving image library/node:16-alpine from registry mirror <registry-uri-0> 
Jul 20 11:08:45  [34m│[0m [36mINFO[0m[0000] Retrieving image manifest node:16-alpine     
Jul 20 11:08:45  [34m│[0m [36mINFO[0m[0000] Returning cached image manifest              
Jul 20 11:08:45  [34m│[0m [36mINFO[0m[0001] Built cross stage deps: map[]                
Jul 20 11:08:45  [34m│[0m [36mINFO[0m[0001] Retrieving image manifest node:16-alpine     
Jul 20 11:08:45  [34m│[0m [36mINFO[0m[0001] Returning cached image manifest              
Jul 20 11:08:45  [34m│[0m [36mINFO[0m[0001] Retrieving image manifest node:16-alpine     
Jul 20 11:08:45  [34m│[0m [36mINFO[0m[0001] Returning cached image manifest              
Jul 20 11:08:45  [34m│[0m [36mINFO[0m[0001] Executing 0 build triggers                   
Jul 20 11:08:45  [34m│[0m [36mINFO[0m[0001] Building stage 'node:16-alpine' [idx: '0', base-idx: '-1'] 
Jul 20 11:08:45  [34m│[0m [36mINFO[0m[0001] Checking for cached layer <registry-uri-1> 
Jul 20 11:08:45  [34m│[0m [36mINFO[0m[0001] Using caching version of cmd: RUN apk add --no-cache python3 make g++ 
Jul 20 11:08:45  [34m│[0m [36mINFO[0m[0001] Resolving srcs [package*.json]...            
Jul 20 11:08:45  [34m│[0m [36mINFO[0m[0001] Checking for cached layer <registry-uri-2> 
Jul 20 11:08:46  [34m│[0m [36mINFO[0m[0001] Using caching version of cmd: RUN npm install --legacy-peer-deps 
Jul 20 11:08:46  [34m│[0m [36mINFO[0m[0001] Checking for cached layer <registry-uri-3> 
Jul 20 11:08:46  [34m│[0m [36mINFO[0m[0001] No cached layer found for cmd RUN if [ -n "$NEXT_PUBLIC_TINA_CLIENT_ID" ] && [ -n "$TINA_TOKEN" ]; then npm run build:cms; else npm run build; fi 
Jul 20 11:08:46  [34m│[0m [36mINFO[0m[0001] Unpacking rootfs as cmd COPY package*.json ./ requires it. 
Jul 20 11:08:48  [34m│[0m [36mINFO[0m[0004] Initializing snapshotter ...                 
Jul 20 11:08:48  [34m│[0m [36mINFO[0m[0004] Taking snapshot of full filesystem...        
Jul 20 11:08:49  [34m│[0m [36mINFO[0m[0004] RUN apk add --no-cache python3 make g++      
Jul 20 11:08:49  [34m│[0m [36mINFO[0m[0004] Found cached layer, extracting to filesystem 
Jul 20 11:08:54  [34m│[0m [36mINFO[0m[0009] WORKDIR /frontend                            
Jul 20 11:08:54  [34m│[0m [36mINFO[0m[0009] Cmd: workdir                                 
Jul 20 11:08:54  [34m│[0m [36mINFO[0m[0009] Changed working directory to /frontend       
Jul 20 11:08:54  [34m│[0m [36mINFO[0m[0009] Creating directory /frontend with uid -1 and gid -1 
Jul 20 11:08:54  [34m│[0m [36mINFO[0m[0009] Taking snapshot of files...                  
Jul 20 11:08:54  [34m│[0m [36mINFO[0m[0009] Resolving srcs [package*.json]...            
Jul 20 11:08:54  [34m│[0m [36mINFO[0m[0009] COPY package*.json ./                        
Jul 20 11:08:54  [34m│[0m [36mINFO[0m[0009] Resolving srcs [package*.json]...            
Jul 20 11:08:54  [34m│[0m [36mINFO[0m[0009] Taking snapshot of files...                  
Jul 20 11:08:54  [34m│[0m [36mINFO[0m[0009] RUN npm install --legacy-peer-deps           
Jul 20 11:08:54  [34m│[0m [36mINFO[0m[0009] Found cached layer, extracting to filesystem 
Jul 20 11:09:21  [34m│[0m [36mINFO[0m[0037] COPY . .                                     
Jul 20 11:09:22  [34m│[0m [36mINFO[0m[0037] Taking snapshot of files...                  
Jul 20 11:09:23  [34m│[0m [36mINFO[0m[0039] ARG NEXT_PUBLIC_TINA_CLIENT_ID               
Jul 20 11:09:23  [34m│[0m [36mINFO[0m[0039] No files changed in this command, skipping snapshotting. 
Jul 20 11:09:23  [34m│[0m [36mINFO[0m[0039] ENV NEXT_PUBLIC_TINA_CLIENT_ID=$NEXT_PUBLIC_TINA_CLIENT_ID 
Jul 20 11:09:23  [34m│[0m [36mINFO[0m[0039] No files changed in this command, skipping snapshotting. 
Jul 20 11:09:23  [34m│[0m [36mINFO[0m[0039] ARG TINA_TOKEN                               
Jul 20 11:09:23  [34m│[0m [36mINFO[0m[0039] No files changed in this command, skipping snapshotting. 
Jul 20 11:09:23  [34m│[0m [36mINFO[0m[0039] ENV TINA_TOKEN=$TINA_TOKEN                   
Jul 20 11:09:23  [34m│[0m [36mINFO[0m[0039] No files changed in this command, skipping snapshotting. 
Jul 20 11:09:23  [34m│[0m [36mINFO[0m[0039] RUN if [ -n "$NEXT_PUBLIC_TINA_CLIENT_ID" ] && [ -n "$TINA_TOKEN" ]; then npm run build:cms; else npm run build; fi 
Jul 20 11:09:25  [34m│[0m [36mINFO[0m[0041] Cmd: /bin/sh                                 
Jul 20 11:09:25  [34m│[0m [36mINFO[0m[0041] Args: [-c if [ -n "$NEXT_PUBLIC_TINA_CLIENT_ID" ] && [ -n "$TINA_TOKEN" ]; then npm run build:cms; else npm run build; fi] 
Jul 20 11:09:25  [34m│[0m [36mINFO[0m[0041] Running: [/bin/sh -c if [ -n "$NEXT_PUBLIC_TINA_CLIENT_ID" ] && [ -n "$TINA_TOKEN" ]; then npm run build:cms; else npm run build; fi] 
Jul 20 11:09:26  [34m│[0m 
Jul 20 11:09:26  [34m│[0m > build:cms
Jul 20 11:09:26  [34m│[0m > tinacms build && next build
Jul 20 11:09:26  [34m│[0m 
Jul 20 11:09:26  [34m│[0m node:internal/errors:478
Jul 20 11:09:26  [34m│[0m     ErrorCaptureStackTrace(err);
Jul 20 11:09:26  [34m│[0m     ^
Jul 20 11:09:26  [34m│[0m 
Jul 20 11:09:26  [34m│[0m TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension "" for /frontend/node_modules/@tinacms/cli/bin/tinacms. Loading extensionless files is not supported inside of "type":"module" package.json contexts. The package.json file /frontend/node_modules/@tinacms/cli/package.json caused this "type":"module" context. Try changing /frontend/node_modules/@tinacms/cli/bin/tinacms to have a file extension. Note the "bin" field of package.json can point to a file with an extension, for example {"type":"module","bin":{"tinacms":"./bin/tinacms.js"}}
Jul 20 11:09:26  [34m│[0m     at new NodeError (node:internal/errors:387:5)
Jul 20 11:09:26  [34m│[0m     at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:75:11)
Jul 20 11:09:26  [34m│[0m     at defaultGetFormat (node:internal/modules/esm/get_format:117:38)
Jul 20 11:09:26  [34m│[0m     at defaultLoad (node:internal/modules/esm/load:81:20)
Jul 20 11:09:26  [34m│[0m     at nextLoad (node:internal/modules/esm/loader:163:28)
Jul 20 11:09:26  [34m│[0m     at ESMLoader.load (node:internal/modules/esm/loader:605:26)
Jul 20 11:09:26  [34m│[0m     at ESMLoader.moduleProvider (node:internal/modules/esm/loader:457:22)
Jul 20 11:09:26  [34m│[0m     at new ModuleJob (node:internal/modules/esm/module_job:63:26)
Jul 20 11:09:26  [34m│[0m     at ESMLoader.#createModuleJob (node:internal/modules/esm/loader:480:17)
Jul 20 11:09:26  [34m│[0m     at ESMLoader.getModuleJob (node:internal/modules/esm/loader:434:34) {
Jul 20 11:09:26  [34m│[0m   code: 'ERR_UNKNOWN_FILE_EXTENSION'
Jul 20 11:09:26  [34m│[0m }
Jul 20 11:09:26  [34m│[0m error building image: error building stage: failed to execute command: waiting for process to exit: exit status 1
Jul 20 11:09:26  [34m│[0m 
Jul 20 11:09:26  [34m│[0m command exited with code 1
Jul 20 11:09:26  [34m│[0m 
Jul 20 11:09:26  [34m│[0m [31m ✘ build failed[0m