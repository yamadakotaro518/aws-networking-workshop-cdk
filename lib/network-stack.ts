import { Stack, StackProps } from "aws-cdk-lib";
import {
  SubnetConfiguration,
  SubnetType,
  Vpc
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export interface NetworkProps extends StackProps {
  readonly vpcName: string;
  readonly cidr: string;
  readonly maxAzs?: number;
  readonly subnetConfiguration?: SubnetConfiguration[];
}
export const setDefaultValue = (props: NetworkProps) => {
  return {
    maxAzs: 2,
    subnetConfiguration: [
      {
        cidrMask: 24,
        name: "public",
        subnetType: SubnetType.PUBLIC,
      },
    ],
    ...props,
  };
};

/**
 * Network Stack
 * VPC及びVPC関連リソースを作成する
 */
export class NetworkStack extends Stack {
  readonly vpc: Vpc;

  constructor(scope: Construct, id: string, props: NetworkProps) {
    super(scope, id, props);

    this.vpc = new Vpc(this, "vpc", { ...setDefaultValue(props) });
  }
}
