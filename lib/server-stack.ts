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
import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export interface ServerProps extends StackProps {
  readonly vpc: Vpc;
  readonly instanceType?: InstanceType;
  readonly machineImage?: IMachineImage;
  readonly vpcSubnets?: SubnetSelection;
  /**
   * アクセス許可するIPアドレス
   */
  readonly allowCiderBlocks?: string[];
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
  readonly publicIpAdress: string;

  constructor(scope: Construct, id: string, props: ServerProps) {
    super(scope, id, props);

    const {
      vpc,
      instanceType,
      machineImage,
      vpcSubnets,
      allowCiderBlocks
    } = setDefaultValue(props);

    // セキュリティグループ作成
    const securityGroup = new SecurityGroup(this, 'securityGroup', {
      securityGroupName: 'security group of ec2',
      vpc: vpc
    })

    allowCiderBlocks?.forEach(ip => {
      securityGroup.addIngressRule(Peer.ipv4(ip), Port.tcp(22))
      securityGroup.addIngressRule(Peer.ipv4(ip), Port.icmpPing())
      securityGroup.addIngressRule(Peer.ipv4(ip), Port.tcp(5201))
    })

    // ec2用のロール作成
    const role = new Role(this, 'ec2role', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore')
      ]
    })

    const instance = new Instance(this, "ec2Instance", {
      vpc,
      instanceType,
      machineImage,
      vpcSubnets,
      securityGroup,
      role
    });
    this.publicIpAdress = instance.instancePublicIp
  }
}
