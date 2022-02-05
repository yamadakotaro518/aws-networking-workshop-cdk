import { Stack, StackProps } from "aws-cdk-lib";
import {
  AmazonLinuxImage,
  IMachineImage,
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType,
  Peer,
  Port,
  SecurityGroup,
  SubnetSelection,
  SubnetType,
  Vpc
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export interface ServerProps extends StackProps {
  readonly vpc: Vpc;
  readonly instanceType?: InstanceType;
  readonly machineImage?: IMachineImage;
  readonly vpcSubnets?: SubnetSelection;
  /**
   * アクセス許可するIPアドレス
   */
  readonly allowIps?: string[];
}
export const setDefaultValue = (props: ServerProps) => {
  return {
    instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
    machineImage: new AmazonLinuxImage(),
    vpcSubnets: props.vpc.selectSubnets({ subnetType: SubnetType.PUBLIC }),
    ...props,
  };
};

/**
 * Server Stack
 * Server関連のリソースを作成する
 */
export class ServerStack extends Stack {

  constructor(scope: Construct, id: string, props: ServerProps) {
    super(scope, id, props);

    const {
      vpc,
      instanceType,
      machineImage,
      vpcSubnets,
      allowIps
    } = setDefaultValue(props);

    // セキュリティグループ作成
    const securityGroup = new SecurityGroup(this, 'securityGroup', {
      securityGroupName: 'security group of ec2',
      vpc: vpc
    })

    allowIps?.forEach(ip => {
      securityGroup.addIngressRule(Peer.ipv4(ip), Port.tcp(22))
      securityGroup.addIngressRule(Peer.ipv4(ip), Port.icmpPing())
    })

    new Instance(this, "ec2Instance", { ...setDefaultValue(props) });
  }
}
