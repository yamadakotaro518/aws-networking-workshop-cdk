import { Stack, StackProps } from "aws-cdk-lib";
import {
  AmazonLinuxImage,
  IMachineImage,
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType,
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
  readonly vpc: Vpc;

  constructor(scope: Construct, id: string, props: ServerProps) {
    super(scope, id, props);

    new Instance(this, "ec2Instance", { ...setDefaultValue(props) });
  }
}
