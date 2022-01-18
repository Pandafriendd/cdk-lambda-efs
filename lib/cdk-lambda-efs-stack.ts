import * as cdk from '@aws-cdk/core';

import * as ec2 from '@aws-cdk/aws-ec2';
import * as efs from '@aws-cdk/aws-efs';
import * as lambda from '@aws-cdk/aws-lambda';

export class CdkLambdaEfsStack extends cdk.Stack {
  
  public accessPoint: efs.AccessPoint;
  public vpc: ec2.IVpc;
  
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    
    
    
    this.vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      isDefault:true
    });
    
    // create a new Amazon EFS filesystem
    const fileSystem = new efs.FileSystem(this, 'Efs', { vpc: this.vpc });
    
    // create a new access point from the filesystem
    this.accessPoint = fileSystem.addAccessPoint('AccessPoint', {
      // set /export/lambda as the root of the access point
      path: '/export/lambda',
      // as /export/lambda does not exist in a new efs filesystem, the efs will create the directory with the following createAcl
      createAcl: {
        ownerUid: '1001',
        ownerGid: '1001',
        permissions: '750',
      },
      // enforce the POSIX identity so lambda function will access with this identity
      posixUser: {
        uid: '1001',
        gid: '1001',
      },
    });
    
    /*
    const fn = new lambda.Function(this, 'MyLambda', {
      // mount the access point to /mnt/msg in the lambda runtime environment
      //filesystem: lambda.FileSystem.fromEfsAccessPoint(this.accessPoint, '/mnt/msg'),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: new lambda.InlineCode('foo'),
      vpc: this.vpc
    });
    */
    
  }
}
