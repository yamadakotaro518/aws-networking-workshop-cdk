import { Stack, StackProps } from "aws-cdk-lib"
import { Vpc, VpcProps } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

interface NetworkProps extends StackProps {
  readonly vpcProps: VpcProps;
}


/**
 * Network Stack
 * VPC及びVPC関連リソースを作成する
 */
export class NetworkStack extends Stack {
  constructor(scope: Construct, id: string, props: NetworkProps){
    super(scope, id, props)

    const { vpcProps } = props;
    
    new Vpc(this, 'vpc', vpcProps)
  }
}