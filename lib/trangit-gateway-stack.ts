import { Stack, StackProps } from 'aws-cdk-lib';
import { CfnTransitGateway, CfnTransitGatewayAttachment, Vpc, SubnetType, Subnet, CfnRoute } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface TransitGatewayProps extends StackProps {
  readonly vpcs: Vpc[];
}

/**
 * transit gateway stack
 */
export class TransitGatewayStack extends Stack {
  readonly transitGatewayId: string;

  constructor(scope: Construct, id: string, props: TransitGatewayProps) {
    super(scope, id, props);

    const transitGateway = new CfnTransitGateway(this, 'transitGateway', {
      description: 'Immersion Day TGW'
    })
    this.transitGatewayId = transitGateway.attrId;

    props.vpcs.forEach((vpc, vpcIndex) => {
      // transit gateway用のsubnetを2つ作成
      const subnet1ForTGW = new Subnet(this, `subnet1ForTGW-vpc${vpcIndex}`, {
        availabilityZone: 'ap-northeast-1a',
        vpcId: vpc.vpcId,
        cidrBlock: `10.${vpcIndex}.2.0/28` 
      })

      const subnet2ForTGW = new Subnet(this, `subnet2ForTGW-vpc${vpcIndex}`, {
        availabilityZone: 'ap-northeast-1c',
        vpcId: vpc.vpcId,
        cidrBlock: `10.${vpcIndex}.3.0/28` 
      })

      // transit gateway attachmentを作成
      new CfnTransitGatewayAttachment(this, `transitGatewayAttachment-vpc${vpcIndex}`, {
        transitGatewayId: transitGateway.attrId,
        vpcId: vpc.vpcId,
        subnetIds: [subnet1ForTGW.subnetId, subnet2ForTGW.subnetId]
      })

      // サブネットのルートテーブルの向き先にTGWを追加
      vpc.publicSubnets.forEach((publicSubnet, subnetIndex) => {
        new CfnRoute(this, `routeForTGW-vpc${vpcIndex}-subnet${subnetIndex}`,{
          routeTableId: publicSubnet.routeTable.routeTableId,
          destinationCidrBlock: '10.0.0.0/8',
          transitGatewayId: this.transitGatewayId
        })
      })
    })
  }
}