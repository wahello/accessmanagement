const DOMAIN_PATH = 'http://192.168.1.52:4000/graphql';
let remote = 'http://192.168.1.52:4000/graphql';
let remote_upload = 'http://192.168.1.52:4000/upload';
let local_upload_import = 'http://192.168.1.52:4000/importUserList';
let websocket_endpoint = 'ws://192.168.1.52:4000/subscriptions';
let remote_assets_path = 'http://192.168.1.52:4000/assets/avatars';
let path = 'http://192.168.1.52:8080';
module.exports.default = DOMAIN_PATH;
module.exports.REMOTE_DOMAIN_PATH = remote;
module.exports.REMOTE_UPLOAD_PATH = remote_upload;
module.exports.LOCAL_IMPORT_PATH = local_upload_import;
module.exports.LOCAL_WEBSOCKET_ENDPOINT = websocket_endpoint;
module.exports.REMOTE_ASSETS_PATH = remote_assets_path;
module.exports.COMMON_PATH = path;