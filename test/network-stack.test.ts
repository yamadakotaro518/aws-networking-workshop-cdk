import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { NetworkStack } from '../lib/network-stack';

const env = {
  account: 'XXXXXXXXXXXX',
  region: 'ap-northeast-1'
}

test('network stack', () => {
  const app = new App();
  const stack = new NetworkStack(app, 'network', {
    env,
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
  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot(); 
})