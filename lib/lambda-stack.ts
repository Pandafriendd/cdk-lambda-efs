import * as cdk from '@aws-cdk/core';

import * as ec2 from '@aws-cdk/aws-ec2';
import * as efs from '@aws-cdk/aws-efs';
import * as lambda from '@aws-cdk/aws-lambda';


export interface LambdaStackProps extends cdk.StackProps {
  /** the function for which we want to count url hits **/
  //accessPoint: efs.IAccessPoint;
  vpc: ec2.IVpc;
}

export class LambdaStack extends cdk.Stack {
  
  constructor(scope: cdk.Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    
    const fn = new lambda.Function(this, 'MyLambda', {
      // mount the access point to /mnt/msg in the lambda runtime environment
      //filesystem: lambda.FileSystem.fromEfsAccessPoint(props.accessPoint, '/mnt/msg'),
      
      filesystem: lambda.FileSystem.fromEfsAccessPoint(
        efs.AccessPoint.fromAccessPointAttributes(this, 'ap', {
          accessPointId: 'fsap-01d2e65e4f4d1c1b4',
          fileSystem: efs.FileSystem.fromFileSystemAttributes(this, 'efs', {
            fileSystemId: 'fs-0f4765a887988bcb1',
            securityGroup: ec2.SecurityGroup.fromSecurityGroupId(this, 'sg', 'sg-06f1202d89445dc08'),
          }),
        }),
        '/mnt/msg'
      ),
      
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: new lambda.InlineCode('foo'),
      vpc: props.vpc
    });
    
  }
}
