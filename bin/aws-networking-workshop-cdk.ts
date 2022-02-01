#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsNetworkingWorkshopCdkStack } from '../lib/aws-networking-workshop-cdk-stack';

const app = new cdk.App();
new AwsNetworkingWorkshopCdkStack(app, 'AwsNetworkingWorkshopCdkStack', {
});