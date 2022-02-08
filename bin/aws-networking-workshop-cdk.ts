#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import "source-map-support/register";
import { NetworkStack } from "../lib/network-stack";
import { ServerStack } from "../lib/server-stack";
import { TransitGatewayStack } from '../lib/trangit-gateway-stack';

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const vpcACiderBlock = "10.0.0.0/16"
const vpcBCiderBlock = "10.1.0.0/16"
const vpcCCiderBlock = "10.2.0.0/16"

const app = new App();

const network1 = new NetworkStack(app, "network1", {
  env,
  vpcName: "VPC A",
  cidr: vpcACiderBlock,
});
const network2 = new NetworkStack(app, "network2", {
  env,
  vpcName: "VPC B",
  cidr: vpcBCiderBlock,
});
const network3 = new NetworkStack(app, "network3", {
  env,
  vpcName: "VPC C",
  cidr: vpcCCiderBlock,
});

new TransitGatewayStack(app, "trangitGateway", {
  vpcs: [network1.vpc, network2.vpc, network3.vpc]
})

new ServerStack(app, "server1", {
  env,
  vpc: network1.vpc,
  allowCiderBlocks: [vpcBCiderBlock, vpcCCiderBlock]
});
new ServerStack(app, "server2", {
  env,
  vpc: network2.vpc,
  allowCiderBlocks: [vpcACiderBlock, vpcCCiderBlock],
});
new ServerStack(app, "server3", {
  env,
  vpc: network3.vpc,
  allowCiderBlocks: [vpcACiderBlock, vpcBCiderBlock],
});
