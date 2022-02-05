#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import "source-map-support/register";
import { NetworkStack } from "../lib/network-stack";
import { ServerStack } from "../lib/server-stack";

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

const network1 = new NetworkStack(app, "network1", {
  env,
  vpcName: "VPC A",
  cidr: "10.0.0.0/16",
});
const network2 = new NetworkStack(app, "network2", {
  env,
  vpcName: "VPC B",
  cidr: "10.1.0.0/16",
});
const network3 = new NetworkStack(app, "network3", {
  env,
  vpcName: "VPC C",
  cidr: "10.2.0.0/16",
});

const server1 = new ServerStack(app, "server1", {
  env,
  vpc: network1.vpc,
});
const server2 = new ServerStack(app, "server2", {
  env,
  vpc: network2.vpc,
  allowCiderBlocks: [server1.publicIpAdress + "/32"],
});
const server3 = new ServerStack(app, "server3", {
  env,
  vpc: network3.vpc,
  allowCiderBlocks: [server1.publicIpAdress + "/32", server2.publicIpAdress + "/32"],
});
