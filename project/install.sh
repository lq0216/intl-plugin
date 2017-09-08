ls ~/nvm || git clone http://gitlab.alibaba-inc.com/node/nvm.git ~/nvm
source ~/nvm/nvm.sh
export NVM_NODEJS_ORG_MIRROR="http://npm.taobao.org/mirrors/node"
nvm install v7.10.0
npm install --registry=http://registry.npm.alibaba-inc.com
