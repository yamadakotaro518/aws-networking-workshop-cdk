#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { NetworkStack } from '../lib/network-stack';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';

const app = new App();
new NetworkStack(app, 'network', {
  vpcProps: {
    vpcName: 'VPC A',
    cidr: '10.0.0.0/16',
    subnetConfiguration: [
      {
        cidrMask: 24,
        name: 'VPC A - AZ1',
        subnetType: SubnetType.PUBLIC
      }
    ]
  }
})