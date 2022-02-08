import { Stack, StackProps } from 'aws-cdk-lib';
import { CfnTransitGateway, CfnTransitGatewayAttachment, Vpc, SubnetType, Subnet } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface TransitGatewayProps extends StackProps {
  readonly vpcs: Vpc[];
}

/**
 * transit gateway stack
 */
export class TransitGatewayStack extends Stack {
  constructor(scope: Construct, id: string, props: TransitGatewayProps) {
    super(scope, id, props);

    const transitGateway = new CfnTransitGateway(this, 'transitGateway', {
      description: 'Immersion Day TGW'
    })

    props.vpcs.forEach((vpc, index) => {
      // transit gateway用のsubnetを2つ作成
      const subnet1ForTGW = new Subnet(this, 'subnet1ForTGW', {
        availabilityZone: 'ap-northeast-1a',
        vpcId: vpc.vpcId,
        cidrBlock: `10.${index}.2.0/28` 
      })

      const subnet2ForTGW = new Subnet(this, 'subnet2ForTGW', {
        availabilityZone: 'ap-northeast-1c',
        vpcId: vpc.vpcId,
        cidrBlock: `10.${index}.3.0/28` 
      })

      // transit gateway attachmentを作成
      new CfnTransitGatewayAttachment(this, 'transitGatewayAttachmentA', {
        transitGatewayId: transitGateway.attrId,
        vpcId: vpc.vpcId,
        subnetIds: [subnet1ForTGW.subnetId, subnet2ForTGW.subnetId]
      })
    })
  }
}