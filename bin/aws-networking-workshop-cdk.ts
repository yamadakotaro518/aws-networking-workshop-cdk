#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { NetworkStack } from "../lib/network-stack";
import { ServerStack } from '../lib/server-stack';
import {
  AmazonLinuxImage,
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType,
  SubnetType,
  Vpc,
} from "aws-cdk-lib/aws-ec2";

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

new ServerStack(app, 'server1', {
  env,
  vpc: network1.vpc
})

const network2 = new NetworkStack(app, "network2", {
  env,
  vpcName: "VPC B",
  cidr: "10.1.0.0/16",
});

new ServerStack(app, 'server2', {
  env,
  vpc: network2.vpc
})

const network3 = new NetworkStack(app, "network3", {
  env,
  vpcName: "VPC C",
  cidr: "10.2.0.0/16",
});

new ServerStack(app, 'server3', {
  env,
  vpc: network3.vpc
})
