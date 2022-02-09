import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import {
  FlowLog,
  FlowLogDestination,
  SubnetConfiguration,
  SubnetType,
  Vpc
} from "aws-cdk-lib/aws-ec2";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
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

    const flowLogLogGroup = new LogGroup(this, 'flowlog-log-group', {
      logGroupName: `vpc-flowlog-${props.vpcName}`,
      retention: RetentionDays.ONE_MONTH,
      removalPolicy: RemovalPolicy.DESTROY // 毎回作り直ししたい
    })

    this.vpc = new Vpc(this, "vpc", { 
      ...setDefaultValue(props),
      flowLogs: {
        flowlog : {
          destination: FlowLogDestination.toCloudWatchLogs(flowLogLogGroup)
        }
      }
    });
  }
}
